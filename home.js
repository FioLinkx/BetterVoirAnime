
$(async function () {
    const animes = await getAnimes();

    // Add save checkbox
    document.querySelectorAll('.meta-item').forEach(function (e) {
        e.style.display = 'flex';
        e.style.justifyContent = 'space-between';
        e.style.alignItems = 'center';

        const title = e.parentElement.parentElement.querySelector('.post-title h3 a').textContent;
        const link = e.parentElement.parentElement.querySelector('.c-image-hover a').getAttribute('href');
        
        const note = document.createElement('input');
        note.type = 'checkbox';
        note.checked = animes.map(a => a.title).includes(title)
        note.setAttribute("data-title", title);
        note.setAttribute("data-link", link);
        note.onchange = async (e) => {
            if (e.target.checked) {
                const animeDetail = await getAnimeDetails($(e.target).data('link'))
                await addAnime(animeDetail)
            } else {
                await removeAnime($(e.target).data('title'))
            }
        }
        e.appendChild(note);
    })

    // Add in progress tab
    const tabName = "En cours"
    const ulElement = document.querySelector(".c-tabs-content");
    
    if (!ulElement.querySelector(`a[data-title="${tabName}"]`)) {
        const newLi = document.createElement("li");
        const newAnchor = document.createElement("a");

        newAnchor.addEventListener("click", setInProgressMode);

        newAnchor.href = "javascript:void(0)";
        newAnchor.setAttribute("data-title", tabName);
        newAnchor.textContent = tabName;
        newLi.appendChild(newAnchor);
        ulElement.appendChild(newLi);
    }

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') == "inprogress") {
        setInProgressMode();
    }
})


async function setInProgressMode() {
    const savedAnimes = await getAnimes();
    if (!savedAnimes.length) return;

    const inProgressAnime = []
    var date = new Date();
    date.setMinutes(date.getMinutes() - 20);

    let change = false;
    // create html with saved anime
    for (const savedAnime of savedAnimes) {
        // Extract past 20 minute, refetch last episode
        if (date > savedAnime.lastExtract) {
            const newData = await getAnimeDetails(savedAnime.home)
            savedAnime.episode.last = newData.episode.last
            savedAnime.episode.number = newData.episode.number
            savedAnime.episode.finalEpisode = newData.episode.finalEpisode
            savedAnime.lastExtract = new Date()
            change = true;
        }
        inProgressAnime.push(makeInProgressAnimeHtml(savedAnime))
    }
    if (change) {
        await browser.storage.local.set({
            animes: savedAnimes
        });
    }

    // Remove all anime from dom
    const animeList = document.querySelector("#loop-content")
    while (animeList.firstChild) {
        animeList.removeChild(animeList.firstChild);
    }

    // Add action
    const actionContainer = document.createElement("div");
    actionContainer.classList = 'page-listing-item'
    actionContainer.style.display = 'flex'
    actionContainer.style.justifyContent = 'center';
    actionContainer.innerHTML = `<div>${savedAnimes.length} Animes en cours</div>`
    document.querySelector("#loop-content").appendChild(actionContainer);

    // Add savedAnime html
    for (let i = 0; i < inProgressAnime.length; i += 2) {
        const container = document.createElement("div");
        container.classList = 'page-listing-item'

        const line = document.createElement("div");
        line.classList = 'row row-eq-height';
        container.appendChild(line);

        if (inProgressAnime.length > i) line.appendChild(inProgressAnime[i]);
        if (inProgressAnime.length > i + 1) line.appendChild(inProgressAnime[i + 1]);

        document.querySelector("#loop-content").appendChild(container);
    }

    // Remove and add new active tab
    document.querySelector(".c-tabs-content").querySelectorAll('li').forEach(element => {
        element.classList = "";
    })
    document.querySelector('a[data-title="En cours"]').parentElement.classList = 'active';
    $('.wp-pagenavi *').hide();
}