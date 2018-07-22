let lines

Circular({}, document.querySelector('.termo-control__arrow-wrapper__arrow'))

function Circular(options, element) {
    const RADIUS = 75

    let angle = 0,
        mouseAngle = 0,
        oldMouseAngle = 0,
        angleOffset = -90,
        value = options.value || null

    const deg2rad = Math.PI / 180
    const rad2deg = 180 / Math.PI

    const minAngle = options.minAngle || -60
    const maxAngle = options.maxAngle || 240

    const minValue = options.minValue ||  0
    const maxValue = options.maxValue || 36

    let mouseDown = false

    const container = document.querySelector('.termo-control')

    const containerSize = {
        x: 150,
        y: 150  
    }

    const arrowSize = {
        x: 10,
        y: 10
    }

    const offset = {
        x: Math.floor(containerSize.x / 2) - Math.floor(arrowSize.x / 2),
        y: Math.floor(containerSize.y / 2) - Math.floor(arrowSize.y / 2)
    }

    updateArrowPosition()
    initEventHandlers()

    function initEventHandlers() {
        container.addEventListener('mousedown', e => mouseDown = true)
        container.addEventListener('mouseup', e => mouseDown = false) 
        container.addEventListener('mousemove', updateAngle)
        container.addEventListener('touchstart', e => mouseDown = true)
        container.addEventListener('touchend', e => mouseDown = false) 
        container.addEventListener('touchmove', updateAngle)
    }

    function getMouseAngle(e) {
        const containerPosition = getOffset(container)

        const mouseLeft = e.clientX - offset.x - containerPosition.left + 0.1
        const mouseTop = e.clientY - offset.y - containerPosition.top + 0.1

        let angle = Math.atan(mouseTop / mouseLeft) * rad2deg

        if (mouseLeft < 0)
            angle += 180
    
        if (angle < 0)
            angle += 360

        return angleOffset - angle
    }

    function updateAngle(e) {
        if (mouseDown) {
            if (e.type === 'touchmove') {
                e.preventDefault()
                mouseAngle = getMouseAngle(e.touches[0])
            } else {
                mouseAngle = getMouseAngle(e)
            }

            const diffAngle = mouseAngle - oldMouseAngle
    
            if ((angle + diffAngle >= minAngle) && (angle + diffAngle <= maxAngle))
                angle += diffAngle
    
            oldMouseAngle = mouseAngle
    
            updateArrowPosition()
            updateLines(Math.round(Math.abs(angle - maxAngle) - 60))
        }
    }

    function updateValue() {
        let newValue = Math.floor(
            (maxValue - minValue + 1) *
            (angle - minAngle) /
            (maxAngle - minAngle)
        )

        value = maxValue - newValue
        document.querySelector('.termo-control__arrow-wrapper__value').innerText = `+${value}`
    }

    function updateArrowPosition() {
        const radAngle = (angle + angleOffset) * deg2rad

        const left = RADIUS * Math.cos(radAngle) + offset.x 
        const top = -RADIUS * Math.sin(radAngle) + offset.y 

        element.style.left = `${left}px`
        element.style.top = `${radAngle > 0 ? top + 8 : top - 8}px`
        element.style.transform = `rotate(${5 / 2 * Math.floor(Math.PI / 2) - radAngle}rad)`
        updateValue()
    }
}

 function createController(activeDeg = 180) {
    const offset = {
        x: 70,
        y: 70
    }

    let currentDeg = -60

    const div = document.querySelector('.termo-control')
    while (currentDeg <= 240) {
        const line = document.createElement('div')
        const content = document.createElement('div')
        content.classList.add('content')
        line.classList.add('termo-control__line')
        currentDeg < activeDeg && line.classList.add('termo-control__line--active')
        line.style.transform = `rotate(${currentDeg}deg)`
        const bottom = div.scrollHeight

        line.appendChild(content)
        div.appendChild(line)
        currentDeg += 3
    }
    lines = document.querySelectorAll('.termo-control__line')
 }

 createController()

 function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function updateLines(angle) {
    let currentDeg = -60
    for (let line of lines) {
        if (currentDeg <= angle && angle !== -60) {
            line.classList.add('termo-control__line--active')
        } else {
            line.classList.remove('termo-control__line--active')
        }
        currentDeg += 3
    }
}