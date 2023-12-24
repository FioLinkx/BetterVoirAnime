
async function addAnime(anime) {
    const animes = await browser.storage.local.get('animes');
    let newAnimes = [anime];
    if (animes.hasOwnProperty('animes')) {
        if (animes.animes.find(a => a.title == anime.title)) {
            newAnimes = animes.animes.map(a => {
                if (a.title == anime.title) a.archive = false
                return a
            });
        } else {
            newAnimes = [...animes.animes, anime];
        }
    }
    await browser.storage.local.set({
        animes: newAnimes
    });
}

async function removeAnime(title) {
    const animes = await browser.storage.local.get('animes');
    const anime = animes.animes.find(a => a.title == title);
    let newAnimes = [];
    if (animes.hasOwnProperty('animes')) {
        if (anime.episode.current == anime.episode.finalEpisode) {
            newAnimes = animes.animes.filter(a => a != anime)
        } else {
            newAnimes = animes.animes.map(a => {
                if (a.title == anime.title) a.archive = true
                return a
            });
        }
    }
    await browser.storage.local.set({
        animes: newAnimes
    });
}

async function getAnimes() {
    res = await browser.storage.local.get('animes');
    return res.animes.filter(a => !a.archive) ?? []
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