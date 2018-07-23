const humburger = document
    .querySelector('.nav__item--humburger__icon')
    .addEventListener('click', toggleHumburger)

let toggled = false

const humburgerMenu = document.querySelector('.nav--humburger')

function toggleHumburger(e) {
    toggled = !toggled

    !toggled
        ? humburgerMenu.classList.remove('nav--humburger--toggled')
        : humburgerMenu.classList.add('nav--humburger--toggled')

}
