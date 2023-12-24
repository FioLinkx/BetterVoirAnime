console.log('utils.js');

async function getAnimeDetails(url) {
    if (url == window.location.href) {
        return extractAnimeDetails(document, url)
    }
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = async function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var contentHTML = xhr.responseText;
                var fakeDocument = document.createElement('div');
                fakeDocument.innerHTML = contentHTML;

                resolve(extractAnimeDetails(fakeDocument, url));
            } else {
                reject('La requête a échoué avec le statut : ' + xhr.status);
            }
        };

        xhr.onerror = function () {
            reject('Une erreur réseau s\'est produite');
        };

        xhr.send();
    });
}

function extractAnimeDetails(fakeDocument, url) {
    let finalEpisode = null;
    for (const section of fakeDocument.querySelectorAll('.post-content_item')) {
        if (section.querySelector('.summary-heading').textContent.trim().startsWith('Episodes')) {
            finalEpisode = parseInt(section.querySelector('.summary-content').textContent.trim());
            break
        }
    }

    const episodeNumber = fakeDocument.querySelectorAll('.listing-chapters_wrap a').length;
    const data = {
        title: fakeDocument.querySelector('.post-title').textContent.trim(),
        home: url,
        poster: fakeDocument.querySelector('meta[property="og:image"]').getAttribute('content'),
        episode: {
            current: null,
            finalEpisode: finalEpisode,
            number: episodeNumber,
            first: fakeDocument.querySelectorAll('.listing-chapters_wrap a')[episodeNumber - 1].getAttribute('href'),
            last: fakeDocument.querySelectorAll('.listing-chapters_wrap a')[0].getAttribute('href'),
        },
        lastExtract: new Date()
    }
    return data
}

function getEpisodeNumberFromLink(url) {
    const split = url.split('-')
    return split[split.length - 2]
}

function changeEpisodeNumberFromLink(url, episode) {
    const split = url.split('-')
    split[split.length - 2] = '0'.repeat(split[split.length - 2].length - episode.toString().length) + episode.toString()
    return split.join('-')
}


function makeInProgressAnimeHtml(anime) {
    const dom = document.createElement('div');
    dom.classList = "col-12 col-md-6 badge-pos-1"

    const lastEpisode = getEpisodeNumberFromLink(anime.episode.last);

    const raw = `
<div class="page-item-detail video">
    <div class="item-thumb  c-image-hover">
        <a href="${anime.home}" title="${anime.title}">
            <img width="110" height="150" src="${anime.poster}" class="img-responsive">
        </a>
    </div>
    <div class="item-summary">
        <div class="post-title font-title">
            <h3 class="h5">
                <a href="${anime.home}">${anime.title}</a>
            </h3>
        </div>
        <div class="list-chapter">
            ${anime.episode.current && anime.episode.current != anime.episode.finalEpisode ? `
            <div class="chapter-item">
                <span class="chapter font-meta">
                    <a href="${anime.episode.current + 1 <= lastEpisode ? changeEpisodeNumberFromLink(anime.episode.first, anime.episode.current + 1) : 'javascript:void(0)'}" class="btn-link">${ '0'.repeat(lastEpisode.length - (anime.episode.current + 1).toString().length)}${anime.episode.current + 1}</a>
                </span>
                <span class="post-on font-meta">${anime.episode.current + 1 <= lastEpisode ? 'Continuer' : 'Bientôt'}</span>
            </div>
            `:''
            }
            ${anime.episode.current && anime.episode.current == anime.episode.finalEpisode ? `
            <div class="chapter-item">
                <span class="chapter font-meta"><a>${'?'.repeat(anime.episode.finalEpisode.toString().length)}</a></span>
                <span class="post-on font-meta">Saison terminé</span>
            </div>
            `:''
            }
            <div class="chapter-item">
                <span class="chapter font-meta">
                    <a href="${anime.episode.last}" class="btn-link">${lastEpisode}</a>
                </span>
                <span class="post-on font-meta">Dernier épisode</span>
            </div>
            <div class="chapter-item">
            <span class="chapter font-meta">
                <a href="${anime.episode.first}" class="btn-link">${getEpisodeNumberFromLink(anime.episode.first)}</a>
            </span>
            <span class="post-on font-meta">Premier épisode</span>
            <input type="checkbox" checked data-title="${anime.title}" data-link="${anime.home}">
        </div>
        </div>
    </div>
</div>
    `
    dom.innerHTML = raw;

    const note = dom.querySelector('input[type="checkbox"]');
    note.onchange = async (e) => {
        if (e.target.checked) {
            const animeDetail = await getAnimeDetails($(e.target).data('link'))
            await addAnime(animeDetail)
        } else {
            await removeAnime($(e.target).data('title'))
        }
    }
    
    return dom
}