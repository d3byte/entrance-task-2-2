const screenWidth = window.screen.innerWidth || document.clientWidth || document.body.clientWidth
const screenHeight = window.screen.innerHeight|| document.clientHeight|| document.body.clientHeight

const categories = document.querySelectorAll('.oval-wrapper')

mapElementsAndHideNotActive(true, elem => elem.addEventListener('click', handleCategoryClick), categories[0])

function handleCategoryClick(e) {
    
    
    if (e.target.classList.contains('oval-wrapper--active') || e.target.parentNode.classList.contains('oval-wrapper--active')) {
        toggleCategories()
    } else {
        chooseCategory()
    }

    function toggleCategories() {
        e.target.classList.remove('oval-wrapper--active')
        if (screenWidth > 768) {
            return
        }
        mapElementsAndHideNotActive(false)
    }

    function chooseCategory() {
        e.target.classList.add('oval-wrapper--active')
        if (screenWidth > 768) {
            mapElementsAndHideNotActive(null, null, e.target)
            return
        }
        mapElementsAndHideNotActive()
    }

}

function mapElementsAndHideNotActive(hide = true, callback, target = null) {
    for (let elem of categories) {
        if (!elem.classList.contains('oval-wrapper--active') && hide  && screenWidth <= 768) {
            elem.classList.add('oval-wrapper--hidden')
        } else if (!hide && screenWidth <= 768) {
            elem.classList.remove('oval-wrapper--hidden')
        } else if (screenWidth > 768 && !elem.isEqualNode(target)) {
            elem.classList.remove('oval-wrapper--active')
        }
        callback ? callback(elem) : null
    }
}