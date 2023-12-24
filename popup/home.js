browser.storage.local.get("animes").then(result => {
    if (!result.hasOwnProperty('animes')) return;

    const animes = result.animes;
  
    for (const anime of animes) {
        const lastEpisode = getEpisodeNumberFromLink(anime.episode.last);
        const raw = `
        <div class="item">
            <div class="mb-2 text-lg title">${anime.title}</div>
            <div class="ml-2">
                ${anime.episode.current && anime.episode.current != anime.episode.finalEpisode ? `
                <div class="mb-2">
                    <a class="link" href="${anime.episode.current + 1 <= lastEpisode ? changeEpisodeNumberFromLink(anime.episode.first, anime.episode.current + 1) : 'javascript:void(0)'}">${'0'.repeat(lastEpisode.length - (anime.episode.current + 1).toString().length)}${anime.episode.current + 1}</a>
                    ${anime.episode.current + 1 <= lastEpisode ? 'Continuer' : 'Bientôt'}
                </div>

                `:''
                }
                <div class="mb-2">
                    <a class="link" href="${anime.episode.last}">${getEpisodeNumberFromLink(anime.episode.last)}</a>
                    Dernier épisode
                </div>
                <div class="mb-2">
                    <a class="link" href="${anime.episode.first}">${getEpisodeNumberFromLink(anime.episode.first)}</a>
                    Premier épisode
                </div>
            </div>
        </div>
        `
        document.getElementById("animes").innerHTML += raw;
    }
  });