function openTab(event, tabId) {
    // obtener todos los elementos con la clase tabcontent y hide ethem
    const tabcontent = Array.from(document.getElementsByClassName('tabcontent'))
    tabcontent.forEach((elemento) => {
        elemento.style.display = 'none'
    })

    // remover la clase is-active de todos los elementos tablisk
    const tablinks = Array.from(document.getElementsByClassName('tablinks'))
    tablinks.forEach(el => {
        el.classList.remove('is-active')
    })
    // mostrar contenido y poner clase is-active
    document.getElementById(tabId).style.display = 'block'
    event.currentTarget.classList.add('is-active')
}


function navSideBar(link, tabId) {
    const tabcontent = Array.from(document.getElementsByClassName('tabcontent'))
    tabcontent.forEach((elemento) => {
        elemento.style.display = 'none'
    })

    const tablinks = Array.from(document.getElementsByClassName('tablinks'))
    tablinks.forEach(el => {
        el.classList.remove('is-active')
    })
    // mostrar contenido y poner clase is-active
    document.getElementById(tabId).style.display = 'block'
    document.getElementsByClassName(link)[0].classList.add('is-active')
}

function ocularElementos() {
    const tabcontent = Array.from(document.getElementsByClassName('tabcontent'))
    tabcontent.forEach((elemento) => {

        if (elemento.id == 'AgregarVehiculo') {
            console.log(elemento)
        } else {
            elemento.style.display = 'none'
        }
    })
}

// evento para detectar el cheacked y habiliar o no el text area
(() => {
    document.getElementById('inputTextArea').addEventListener('change', e => {
        if (e.target.checked) {
            document.querySelector('textarea.textarea').disabled = false

        } else {
            document.querySelector('textarea.textarea').disabled = true
        }
    })
})()

function fromTimestampToLocalString(timestamp) {
    let fecha = new Date(timestamp * 1000)
    return `fecha : ${fecha.toLocaleString()}`
}



addEventListener('DOMContentLoaded', e => {
    const menu_movil = document.getElementById('menu-movil')
    menu_movil.addEventListener('click', event => {
        const menuMovilCont = document.querySelector('.navbar-menu')
        menuMovilCont.classList.toggle('is-active')
    })
})




ocularElementos()
