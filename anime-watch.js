
// Correct host select when page reload
const select = document.querySelector('.single-chapter-select');
for (const option of select.options) {
    if (option.getAttribute('data-redirect') == window.location.href) {
        option.selected = true;
    };
}

document.querySelector("button.btn").addEventListener("click", function () {
    // Mark anime as in progress when watch episode
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
        await setAnimeEpisode(title, parseInt(episode))
    }, 60000 * 4)

    // Control background style
    $('.content-area').css('background-color', '#25242D')
    $('.content-area').css('color', 'white')
    $('.c-sub-header-nav').css('background-color', '#25242D')
    $('.c-sub-header-nav').css('color', 'white')
});