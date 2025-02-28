document.addEventListener("DOMContentLoaded", async function () {
    await loadProducts();
    initializeDescriptions();
    setupReadMoreButtons();
    setupSearhButtons();
});

async function loadProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products")
        const data = await response.json()
    
        const productList = document.querySelector(".product-list");
        const products = data.products.slice(0, 10)
        console.log(products)
    
        products.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(product.price);
    
            const stars = "⭐".repeat(Math.round(product.rating));
    
            const productHTML = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
    
                    <div class="product-name">
                        <p><strong>${product.title}</strong></p>
                    </div>
    
                    <div class="product-price">
                        <p>${formattedPrice}</p>
                    </div>
    
                    <div class="product-rating">
                        ${stars} (${product.rating})
                    </div>
    
                    <div class="product-desc">
                        <p class="desc-text" data-full="${product.description}"></p>
                    </div>
    
                    <div class="read-more-btn">
                        <button class="toggle-btn">Read More</button>
                    </div>
                </div>
            `
            productList.innerHTML += productHTML;
        });
    } catch (error) {  
        console.error("Error loading products", error);
    }
}

function initializeDescriptions() {
    const descTexts = document.querySelectorAll(".desc-text");
    descTexts.forEach(descText => {
        const fullText = descText.getAttribute("data-full");
        if (!fullText) return; 

        const shortText = fullText.substring(0, 50) + "..."; 
        descText.innerText = shortText;
    });
}

function setupReadMoreButtons() {
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("button clicked");

            const descText = this.parentElement.previousElementSibling.querySelector(".desc-text");
            const fullText = descText.getAttribute("data-full");
            const shortText = fullText.substring(0, 50) + "...";

            if (descText.innerText === shortText) {
                descText.innerText = fullText;
                this.innerText = "Read Less";
            } else {
                descText.innerText = shortText;
                this.innerText = "Read More";
            }
        });
    });
}

function setupSearhButtons() {
    const searchButton = document.querySelector(".search-btn");
    const searchInput = document.querySelector(".search-input");

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        console.log(searchInput.value);

        let found = false

        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach(card => {
            const productName = card.querySelector(".product-name").innerText.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = "block";
                found = true
            } else {
                card.style.display = "none";
                
            }
            let noResultsMessage = document.querySelector("#no-results");

            if (!found) {
                if (!noResultsMessage) {
                    noResultsMessage = document.createElement("p");
                    noResultsMessage.id = "no-results";
                    noResultsMessage.innerText = "No items available";
                    noResultsMessage.style.textAlign = "center";
                    noResultsMessage.style.fontSize = "36px";
                    noResultsMessage.style.color = "gray";
                    noResultsMessage.style.marginTop = "50px";
                    document.querySelector(".product-list").appendChild(noResultsMessage);
                }
            } else {
                if (noResultsMessage) noResultsMessage.remove();
            }
        });
    }
    searchButton.addEventListener("click", searchProducts);
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });
}