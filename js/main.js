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
const cartTableGoods = document.querySelector('.cart-table__goods')
const cardTableTotal = document.querySelector('.card-table__total')
const cartCount = document.querySelector('.cart-count')
const btnClear = document.querySelector('.btn-clear')

const getGoods = async function() {
    const result = await fetch('db/db.json')
    if (!result.ok) {
        throw 'Упс! Что-то пошло не так... ' + result.status
    }
    return result.json()
}

const cart = {
    cartGoods: [],
    cartCounter() {
        cartCount.textContent = this.cartGoods.reduce((sum, item) => {
            return sum + item.count
        }, 0)
    },
    clearCart() {
        this.cartGoods.length = 0
        this.cartCounter()
        this.renderCart()
    },
    renderCart() {
        cartTableGoods.textContent = ''
        this.cartGoods.forEach(({ id, name, price, count }) => {
            const trGood = document.createElement('tr')
            trGood.className = 'cart-item'
            trGood.dataset.id = id
            trGood.innerHTML =
                `
            <td>${name}</td>
            <td>${price}</td>
            <td><button class="cart-btn-minus">-</button></td>
            <td>${count}</td>
            <td><button class="cart-btn-plus">+</button></td>
            <td>${price*count}</td>
            <td><button class="cart-btn-delete">x</button></td>
            `
            cartTableGoods.append(trGood)
        })

        const totalPrice = this.cartGoods.reduce((sum, item) => {
            return sum + (item.price * item.count)
        }, 0)

        cardTableTotal.textContent = totalPrice + '$'
    },
    deleteGood(id) {
        this.cartGoods = this.cartGoods.filter(item => id !== item.id)
        this.renderCart()
        this.cartCounter()
    },
    minusGood(id) {
        for (const item of this.cartGoods) {
            if (item.id === id) {
                if (item.count <= 1) {
                    this.deleteGood(id)
                } else {
                    item.count--
                }
                break
            }
        }
        this.renderCart()
        this.cartCounter()
    },
    plusGood(id) {
        for (const item of this.cartGoods) {
            if (item.id === id) {
                item.count++
                    break
            }
        }
        this.renderCart()
        this.cartCounter()
    },
    addCartGoods(id) {
        const goodItem = this.cartGoods.find(item => item.id === id)
        if (goodItem) {
            this.plusGood(id)
        } else {
            getGoods()
                .then(data => data.find(item => item.id === id))
                .then(({ id, name, price }) => {
                    this.cartGoods.push({
                        id,
                        name,
                        price,
                        count: 1
                    })
                    this.cartCounter()
                })
        }
    }
}

btnClear.addEventListener('click', () => {
    cart.clearCart()
})

document.body.addEventListener('click', event => {
    const addToCart = event.target.closest('.add-to-cart')
    if (addToCart) {
        cart.addCartGoods(addToCart.dataset.id)
    }
})

cartTableGoods.addEventListener('click', event => {
    const target = event.target

    if (target.tagName === 'BUTTON') {
        const id = target.closest('.cart-item').dataset.id

        if (target.classList.contains('cart-btn-delete')) {
            cart.deleteGood(id)
        }
        if (target.classList.contains('cart-btn-minus')) {
            cart.minusGood(id)
        }
        if (target.classList.contains('cart-btn-plus')) {
            cart.plusGood(id)
        }
    }
})

const openModal = function() {
    cart.renderCart()
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

const viewAll = document.querySelectorAll('.view-all')
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)')
const longGoodsList = document.querySelector('.long-goods-list')
const showAcsessories = document.querySelectorAll('.show-acsessories')
const showClothes = document.querySelectorAll('.show-clothes')

const createCard = function({ label, name, img, description, id, price }) {
        const card = document.createElement('div')
        card.className = 'col-lg-3 col-sm-6'

        card.innerHTML = `
        <div class="goods-card">
            ${label ? `<span class="label">${label}</span>` : ''}
            <img src="db/${img}" alt="image: ${name}" class="goods-image">
            <h3 class="goods-title">${name}</h3>
            <p class="goods-description">${description}</p>
            <button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
        </div>
    `
    return card;
}

const renderCards = function(data) {
    longGoodsList.textContent = ''
    const cards = data.map(createCard);
    cards.forEach(function(card) {
        longGoodsList.append(card)
    })

    document.body.classList.add('show-goods')
}

const showAll = function(event) {
    event.preventDefault()
    getGoods().then(renderCards)
}

viewAll.forEach(function(elem) {
    elem.addEventListener('click', showAll)
})

const filterCards = function(field, value) {
    getGoods().then(function(data) {
        const filteredGoods = data.filter(function(good) {
            return good[field] === value
        })
        return filteredGoods
    })
    .then(renderCards)
}

navigationLink.forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault()
        const field = link.dataset.field
        const value = link.textContent
        filterCards(field, value)
    })
})

showAcsessories.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault()
        filterCards('category', 'Accessories')
    }) 
})

showClothes.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault()
        filterCards('category', 'Clothing')
    }) 
})