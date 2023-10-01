const container = document.querySelector("#container")

let mainData
let sortedData
let arr3
let arr4
let totalPages

const fetchData = async () => {
    try {
        const res = await fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
        const data = await res.json()
        mainData = data
        arr3 = data
        arr4 = data
        displayCards(mainData)
        displayList(mainData, container, rows, currentPage)
        totalPages = (Math.floor(data.length / rows) + 1) 
        calculatePageCount(totalPages)
    } catch(e) {
        console.log("Error occured")
    }
}

fetchData()

const displayCards = (data) => {
    container.innerHTML = ""
    for(let card of data) {
        const UI = `
        <div class="card" style="width: 20rem;">
        <img src="${card.image_link}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${card.name}</h5>
          <p class="card-text ${card.id}">${card.description}</p>
        </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item"><button id="${card.id}" class="btn btn-info show-more" style="width:50%;">Show more</button></li>
        <li class="list-group-item">Price : ${card.price}$</li>
        ${card.rating ? `<li class="list-group-item">Rating : ${card.rating} &#9733;</li>` : ""}
        <li class="list-group-item">Product type : ${card.product_type}</li>
        </ul>
        </div>
        `
        container.innerHTML += UI
    }
    const buttons = document.querySelectorAll(".show-more")
    for(let i of buttons) {
        let show = true
        i.addEventListener("click", function() {
            if(show) {
                show = !show
                const description = document.getElementsByClassName(`${this.id}`)
                description[0].style.height = "auto"
                this.textContent = "Hide"
            } else {
                show = !show
                const description = document.getElementsByClassName(`${this.id}`)
                description[0].style.height = "100px"
                this.textContent = "Show"
            }
        })
    }
   
}

//Filter

const userName = document.getElementById("name")
const price = document.getElementById("price")

userName.addEventListener("input", () => {
    arr3 = arr4
    initializeByName()
    if(price.value !== "default-filter") {
        initializeByPrice()
    }
})

function initializeByName() {
    if(userName.value !== "") {
        sortedData = mainData.filter(product => product.name.includes(userName.value))
        displayCards(sortedData)
        arr3 = arr3.filter(product => product.name.includes(userName.value))
        if(arr3) {
        currentPage = 1
        displayList(arr3,container,rows,currentPage)
        calculatePageCount(Math.floor(arr3.length / rows) + 1)
        }
    } else {
        sortedData = mainData
        displayCards(sortedData)
        currentPage = 1
        displayList(arr3,container,rows,currentPage)
        calculatePageCount(Math.floor(arr3.length / rows) + 1)
    }
}

price.addEventListener("change", () => {
    initializeByName()
    initializeByPrice()
})

function initializeByPrice() {
    if(price.value === "zrdadobit") {
        if(sortedData) {
            sortedData = sortedData.sort((a,b) => Number(a.price) - Number(b.price))
        } else {
            sortedData = mainData.sort((a,b) => Number(a.price) - Number(b.price))
        }

    } else if(price.value === "klebadobit") {
        if(sortedData) {
            sortedData = sortedData.sort((a,b) => Number(b.price) - Number(a.price))
        } else {
            sortedData = mainData.sort((a,b) => Number(b.price) - Number(a.price))
        }
    } 
    displayCards(sortedData)
    if(price.value === "default-filter") {
        initializeByName()
    }
}

//Pagination 

let currentPage = 1
let rows = 10

function displayList(items,wrapper,rowsPerPage,page) {
    wrapper.innerHTML = ""
    page --

    let start = rowsPerPage * page
    let end = start + rowsPerPage

    let pagintedItems = items.slice(start, end)
    
    mainData = pagintedItems
    sortedData = mainData
    displayCards(pagintedItems)
}

const pagination = document.getElementById("pagination")

function calculatePageCount(num) {
    pagination.innerHTML = ""
    for(let i = 1; i <= num; i++) {
        const UI = `
        <button class="choose-page btn ${i === currentPage ? "btn-primary" : "btn-secondary"} m-2">${i}</button>
        `
        pagination.innerHTML += UI
    }
    const buttons = document.querySelectorAll(".choose-page")
    for(let i of buttons) {
        i.addEventListener("click", () => {
            currentPage = Number(i.textContent)
            calculatePageCount(Math.floor(arr3.length / rows) + 1)
            displayList(arr3,container,rows,currentPage)
        })
    }
}

// displayList(sortedData, container, rows, currentPage)