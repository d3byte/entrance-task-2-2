const btns = [
    [
        '.home__half-splitted-section .content-container:nth-of-type(2) .controls img:first-of-type',
        '.home__half-splitted-section .content-container:nth-of-type(2) .controls img:last-of-type'
    ],
    [
        '.home > .content-container .controls img:first-of-type',
        '.home > .content-container .controls img:last-of-type'
    ]
]

const favActionsSlider = new createActionsSlider(
    '.home__half-splitted-section .content-container:nth-of-type(2) .info-card',
    document.querySelector(btns[0][0]),
    document.querySelector(btns[0][1]),
    9
)

const favGadgetsSlider = new createGadgetsSlider(
    '.home > .content-container .info-card',
    document.querySelector(btns[1][0]),
    document.querySelector(btns[1][1])
)

reCalculateRowsInFavEvents()
favGadgetsSlider.updateScreenSizeInfo()

window.onresize = e => {
    reCalculateRowsInFavEvents()
    favGadgetsSlider.updateScreenSizeInfo()
}

function createActionsSlider(elemSelector, btnBackwards, btnForwards, difference = 6) {
    const elems = document.querySelectorAll(elemSelector)
    
    this.difference = difference

    let currentElemGroup = [0, difference]

    this.updateElems = (animated = false, toRight = true) => {
        let index = 0, indexOfCurrentGroup = 0
        for (let elem of elems) {
            index++
            if (index < currentElemGroup[0] || index > currentElemGroup[1]) {
                if (animated) {
                    const animation = toRight ? 'slide-left' : 'slide-right'
                    elem.classList.add(animation)
                    elem.style.position = 'absolute'
                    setTimeout(() => {
                        elem.style.position = 'relative'
                        elem.classList.remove(animation)
                        elem.classList.add('info-card--hide')
                    }, 300)
                    continue
                }
                elem.classList.add('info-card--hide')
            
                continue
            }

            indexOfCurrentGroup++
            const screenWidth = window.screen.innerWidth || document.clientWidth || document.body.clientWidth

            if (screenWidth > 768) {
                if (this.difference === 9 && (indexOfCurrentGroup % 7 === 0 || indexOfCurrentGroup % 8 === 0 || indexOfCurrentGroup % 9 === 0)) {
                    elem.classList.add('no-margin-bottom')
                } else {
                    elem.classList.remove('no-margin-bottom')
                }
    
                if (indexOfCurrentGroup % 3 === 0) {
                    elem.classList.add('no-margin-right')
                } else {
                    elem.classList.remove('no-margin-right')
                }
            }

            
            if (animated) {
                const animation = toRight ? 'slide-right-left' : 'slide-left-right'
                elem.classList.add(animation)
                setTimeout(() => {
                    elem.classList.remove(animation)
                }, 500)
            }
            elem.classList.remove('info-card--hide')
        }
    }

    this.updateDifference = newDiff => {
        this.difference = newDiff
        currentElemGroup = [0, this.difference]
        this.updateElems()
        updateBackButton()
        updateForwardButton()
    }

    this.deactivateForMobile = () => this.updateDifference(elems.length)

    this.updateElems()

    updateForwardButton()

    function updateBackButton() {
        if (currentElemGroup[0] !== 0) {
            btnBackwards.setAttribute('src', 'assets/Icons/arrow_slide.png')
            btnBackwards.style.cursor = 'pointer'
            return
        }
        btnBackwards.style.cursor = 'default'
        btnBackwards.setAttribute('src', 'assets/Icons/ Arrow Right / M Copy@2x.png')
    }

    function updateForwardButton() {
        if (currentElemGroup[1] < elems.length) {
            btnForwards.setAttribute('src', 'assets/Icons/arrow_slide.png')
            btnForwards.style.cursor = 'pointer'
            return
        }
        btnForwards.setAttribute('src', 'assets/Icons/ Arrow Right / M Copy@2x.png')
        btnForwards.style.cursor = 'default'
    }

    btnBackwards.addEventListener('click', () => {
        if (currentElemGroup[0] !== 0) {

            if (currentElemGroup[1] - this.difference < this.difference) {
                currentElemGroup[1] = this.difference
            } else if (currentElemGroup[1] === elems.length) {
                currentElemGroup[1] = elems.length - (currentElemGroup[1] - currentElemGroup[0])
            } else if (currentElemGroup[1] - this.difference >= this.difference) {
                currentElemGroup[1] -= this.difference
            }

            currentElemGroup[0] - this.difference <= 0 
                ? (currentElemGroup[0] = 0)
                : (currentElemGroup[0] -= this.difference)


            updateForwardButton()
            updateBackButton()

            this.updateElems(true, false)
        }
    })

    btnForwards.addEventListener('click', () => {
        if (currentElemGroup[1] < elems.length) {
            currentElemGroup[1] + this.difference <= elems.length 
                ? (currentElemGroup[1] += this.difference)
                : (currentElemGroup[1] += elems.length - currentElemGroup[1])

            currentElemGroup[0] += this.difference

            updateForwardButton()
            updateBackButton()

            this.updateElems(true)
        }
    })
    
}

function createGadgetsSlider(elemSelector, btnBackwards, btnForwards) {
    const elems = document.querySelectorAll(elemSelector)
    const styles = window.getComputedStyle(elems[0])
    
    this.screenWidth = window.screen.innerWidth || document.clientWidth || document.body.clientWidth
    this.containerWidth = document.querySelector('.fav-gadgets').clientWidth
    this.difference = elems[0].clientWidth + parseInt(styles['marginRight'])
    this.cardsInViewport = Math.floor((this.containerWidth + parseInt(styles['marginRight'])) / this.difference)
    this.currentElemGroup = [0, this.cardsInViewport - 1]
    this.transitionState = 0

    this.updateScreenSizeInfo = () => {
        this.screenWidth = window.screen.innerWidth || document.clientWidth || document.body.clientWidth
        this.containerWidth = document.querySelector('.fav-gadgets').clientWidth
        this.cardsInViewport = Math.floor((this.containerWidth + parseInt(styles['marginRight'])) / this.difference)
        this.currentElemGroup = [0, this.cardsInViewport - 1]
        this.resetTransitions()
        this.updateBackButton()
        this.updateForwardButton()
    }

    this.resetTransitions = () => {
        this.transitionState = 0
        for (let elem of elems) {
            elem.style.transform = 'translateX(0)'
        }
    }

    this.transitionToRight = () => {
        if (this.currentElemGroup[1] < elems.length - 1) {
            this.currentElemGroup[0] += this.cardsInViewport
            this.currentElemGroup[1] += this.cardsInViewport
            this.transitionState -= this.difference * (this.currentElemGroup[1] - this.currentElemGroup[0] + 1)
            for (let elem of elems) {
                elem.style.transform = `translateX(${this.transitionState}px)`
            }
        }
    }

    this.transitionToLeft = () => {
        if (this.currentElemGroup[0] > 0) {
            this.currentElemGroup[0] -= this.cardsInViewport
            this.currentElemGroup[1] -= this.cardsInViewport
            this.transitionState += this.difference * (this.currentElemGroup[1] - this.currentElemGroup[0] + 1)
            for (let elem of elems) {
                elem.style.transform = `translateX(${this.transitionState}px)`
            }
        }
    }

    
    this.updateBackButton = () => {
        if (this.currentElemGroup[0] !== 0) {
            btnBackwards.setAttribute('src', 'assets/Icons/arrow_slide.png')
            btnBackwards.style.cursor = 'pointer'
            return
        }
        btnBackwards.style.cursor = 'default'
        btnBackwards.setAttribute('src', 'assets/Icons/ Arrow Right / M Copy@2x.png')
    }
    
    this.updateForwardButton = () => {
        if (this.currentElemGroup[1] < elems.length - 1) {
            btnForwards.setAttribute('src', 'assets/Icons/arrow_slide.png')
            btnForwards.style.cursor = 'pointer'
            return
        }
        btnForwards.setAttribute('src', 'assets/Icons/ Arrow Right / M Copy@2x.png')
        btnForwards.style.cursor = 'default'
    }

    btnForwards.addEventListener('click', () => {
        this.transitionToRight()
        this.updateForwardButton()
        this.updateBackButton()
    })

    btnBackwards.addEventListener('click', () => {
        this.transitionToLeft()
        this.updateForwardButton()
        this.updateBackButton()
    })

    this.updateForwardButton()
    this.updateBackButton()
}

function reCalculateRowsInFavEvents() {
    const screenWidth = window.screen.innerWidth || document.clientWidth || document.body.clientWidth
    const screenHeight = window.screen.innerHeight|| document.clientHeight|| document.body.clientHeight
    
    if (screenWidth >= 768 && screenHeight >= 670) {
        favActionsSlider.updateDifference(9)
    } else if (screenWidth <= 1280 && screenWidth >= 1024 && screenHeight <= 640) {
        favActionsSlider.updateDifference(6)
    } else if (screenWidth <= 1280 && screenWidth >= 769 && screenHeight <= 640) {
        favActionsSlider.updateDifference()
    } else if (screenWidth <= 768) {
        favActionsSlider.deactivateForMobile()
    }
}