console.log('anime-watch.js');

// Correct host select when page reload
const select = document.querySelector('.single-chapter-select');
for (const option of select.options) {
    if (option.getAttribute('data-redirect') == window.location.href) {
        option.selected = true;
    };
}

// Mark anime as in progress when watch episode
document.querySelector("button.btn").addEventListener("click", function () {
    setTimeout(async function () {
        const title = document.querySelectorAll('.breadcrumb li a')[1].textContent.trim();
        const options = document.querySelectorAll('.single-chapter-select option');
        let episode = null;
        for (const option of options) {
            if (option.getAttribute('data-redirect') == window.location.href) episode = option.textContent;
        }
        const animes = await getAnimes();
        if (!animes.find(a => a.title == title)) {
            const animeDetail = await getAnimeDetails(window.location.href.split('/').slice(0, -2).join('/'))
            await addAnime(animeDetail)
        }
        console.log('Set', title, 'to episode', episode);
        await setAnimeEpisode(title, parseInt(episode))
    }, 60000 * 1)
});