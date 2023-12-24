
$(async function () {
    const animes = await getAnimes();
    const title = $('.post-title').text().trim();
    const anime = animes.find(a => a.title == title)

    // Insert in progress checkbox
    const dom = document.createElement('div');
    dom.classList = "post-content_item"
    const raw = `
    <div class="summary-heading">
        <h5>En cours</h5>
    </div>
    <div class="summary-content">
        <input type="checkbox" ${anime ? 'checked':''} data-title="${title}" data-link="${window.location.href}"/>
    </div>
    `;
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
    $(dom).insertAfter('.post-rating');


    // Style current episode
    if (anime && anime.episode.current) {
        const zero = '0'.repeat(anime.episode.number.toString().length - (anime.episode.current + 1).toString().length);
        for (const episode of document.querySelectorAll('.wp-manga-chapter a')) {
            if (episode.textContent.trim().endsWith(` ${zero}${anime.episode.current + 1}`)) {
                episode.style.color = '#7188d9';
            }
        }

        const ancre = document.createElement('a');
        ancre.classList = 'c-btn c-btn_style-1'
        ancre.textContent = 'EP en cours'
        ancre.href = changeEpisodeNumberFromLink(anime.episode.first, anime.episode.current + 1)
        $(ancre).insertAfter('#btn-read-last')
    }
});