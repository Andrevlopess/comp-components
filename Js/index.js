const tabOptionsContainer = document.querySelector('#tabOptionsContainer');
const tabOptions = document.querySelectorAll('#tabOptionsContainer > button');
const tabIndicator = document.querySelector('#tabIndicator > div');

const tabWindowsContainer = document.querySelector('#tabWindowContainer');

tabOptionsContainer.style.setProperty('--grid-length', `repeat(${tabOptions.length} , 1fr)`);
tabIndicator.style.width = `${(100 / tabOptions.length)}%`

for (let i = 0; i < tabOptions.length; i++) {

    const tab = tabOptions[i];

    tab.addEventListener('click', e => {


        tabWindowsContainer.querySelectorAll('div').forEach(window => {
            if (window.getAttribute('data-window') === tab.getAttribute('data-window-id')) {
                tabWindowsContainer.querySelector(".active").classList.remove("active");
                window.classList.add('active');
            }
        })

        // remove actives tabs
        tabOptionsContainer.querySelector(".active").classList.remove("active");

        tab.classList.add('active')
        tabIndicator.style.left = `${i * (100 / tabOptions.length)}%`
    })
}