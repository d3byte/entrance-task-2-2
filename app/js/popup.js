const gadgets = document.querySelectorAll('.fav-gadgets .info-card')

for (let gadget of gadgets) {
    gadget.addEventListener('click', e => {
        const title = e.target.querySelector('.info-card__details__title').innerText
        const status = e.target.querySelector('.info-card__details__sub-title').innerText
        const popupType = e.target.dataset.popupType

        const popupTarget = document.querySelector(`.popup[data-popup-type="${popupType}"]`)
        const popupBlur = document.querySelector('.popup-blur')

        popupTarget.querySelector('.popup__container__header__info__title').innerText = title
        popupTarget.querySelector('.popup__container__header__info__status').innerText = status

        popupTarget.querySelector('.popup__actions__button:first-of-type')
            .addEventListener('click', e => closePopup(popupTarget, popupBlur))

        popupTarget.querySelector('.popup__actions__button:last-of-type')
            .addEventListener('click', e => closePopup(popupTarget, popupBlur))

        popupBlur.classList.remove('hide')
        popupTarget.classList.remove('hide')
    })
}

function closePopup(target, blur) {
    console.log(target)
    target.classList.add('animate-out')
    blur.classList.add('animate-out')
    setTimeout(() => {
        target.classList.add('hide')
        target.classList.remove('animate-out')
        blur.classList.add('hide')
        blur.classList.remove('animate-out')
    }, 430)
}