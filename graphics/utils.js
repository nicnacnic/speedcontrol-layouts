async function fadeOut(element, time) {
    return new Promise((resolve) => {
        let el = document.querySelector(element);
        let minus = 1 / time;
        let interval = setInterval(() => {
            el.style.opacity = `${el.style.opacity - minus}`;
            if (el.style.opacity <= 0) {
                clearInterval(interval);
                resolve()
            }
        }, time / 100)
        // el.style.transition = `opacity ${time}ms`;
        // el.style.opacity = "0";
        // setTimeout(() => resolve(), time)
    })
}

async function fadeIn(element, time) {
    return new Promise((resolve) => {
        let el = document.querySelector(element);
        let plus = 1 / time;
        let interval = setInterval(() => {
            el.style.opacity = `${el.style.opacity + plus}`;
            if (el.style.opacity >= 1) {
                clearInterval(interval);
                resolve()
            }
        }, time / 100)
    })
}

async function setHtml(element, html) {
    document.querySelector(element).innerHTML = html;
    return;
}