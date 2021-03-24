const mySwiper = new Swiper('.swiper-container', {
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: '.slider-button-next',
        prevEl: '.slider-button-prev',
    },
});

// cart

const buttonCart = document.querySelector('.button-cart')
const modalCart = document.querySelector('#modal-cart')
const modalClose = document.querySelector('.modal-close')

const openModal = function() {
    modalCart.classList.add('show')
}

const closeModal = function() {
    modalCart.classList.remove('show')
}

buttonCart.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)

modalCart.addEventListener('click', function(event) {
    if (event.target.classList.contains('overlay'))
        closeModal()
})


// smoothscroll

{
    const scrollLinks = document.querySelectorAll('a.scroll-link')

    for (let i = 0; i < scrollLinks.length; i++) {
        scrollLinks[i].addEventListener('click', function(event) {
            event.preventDefault()
            const id = scrollLinks[i].getAttribute('href')
            document.querySelector(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    }
}

// goods

const more = document.querySelector('.more')
const navigationItem = document.querySelectorAll('.navigation-item')
const longGoodsList = document.querySelector('.long-goods-list')

const getGoods = async function() {
    const result = await fetch('db/db.json')
    if (!result.ok) {
        throw 'Упс! Что-то пошло не так... ' + result.status
    }
    return result.json()
}

getGoods().then(function(data) {
    console.log(data)
})

const createCard = function(objCard) {
    const card = document.createElement('div')
    card.className = 'col-lg-3 col-sm-6'
    card.innerHTML = `
        <div class="goods-card">
            <span class="label">New</span>
            <img src="img/image-119.jpg" alt="image: Hoodie" class="goods-image">
            <h3 class="goods-title">Embroidered Hoodie</h3>
            <p class="goods-description">
                Yellow/Lilac/Fuchsia/Orange
            </p>
            <button class="button goods-card-btn add-to-cart" data-id="007">
				<span class="button-price">$89</span>
			</button>
        </div>
    `
    return card
}

const renderCards = function(data) {
    longGoodsList.textContent = ''

    const cards = data.map(createCard)
    cards.forEach

    document.body.classList.add('show-goods')
}

renderCards()