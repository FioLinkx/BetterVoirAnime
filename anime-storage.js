console.log('anime-storage.js');

async function addAnime(anime) {
    const animes = await browser.storage.local.get('animes');
    let newAnimes = [anime];
    if (animes.hasOwnProperty('animes')) {
        if (animes.animes.map(a => a.title).includes(anime.title)) return;
        newAnimes = [...animes.animes, anime];
    }
    await browser.storage.local.set({
        animes: newAnimes
    });
}

// TODO système d'archive au lieu de supprimer
async function removeAnime(anime) {
    const animes = await browser.storage.local.get('animes');
    let newAnimes = [];
    if (animes.hasOwnProperty('animes')) {
        newAnimes = animes.animes.filter(a => a.title != anime);
    }
    console.log(anime, newAnimes);
    await browser.storage.local.set({
        animes: newAnimes
    });
}

async function getAnimes() {
    res = await browser.storage.local.get('animes');
    return res.animes ?? []
}


async function setAnimeEpisode(animeTitle, episode) {
    const animes = await getAnimes();
    for (const anime of animes) {
        if (anime.title == animeTitle.trim()) {
            anime.episode.current = episode
        }
    }
    await browser.storage.local.set({
        animes: animes
    });
}