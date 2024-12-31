// Initialize the cart in localStorage if it doesn't exist
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}

// Retrieve the cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart"));

// Function to add item to the cart
function addItemToCart(name, price) {
    if (isNaN(price)) {
        console.error(`Invalid price for ${name}. Item not added to cart.`);
        return;
    }

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    saveCartToLocalStorage();
}

// Function to update cart UI, total, and notification number
function updateCart() {
    const cartItemsElement = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartNotification = document.getElementById("cart-notification");

    if (cartItemsElement && cartTotalElement) {
        cartItemsElement.innerHTML = ""; // Clear current cart items
        let total = 0;
        let totalQuantity = 0;

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalQuantity += item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - PHP ${item.price.toFixed(2)} x ${item.quantity}
                <button class="remove-item" data-name="${item.name}">Remove</button>
            `;
            cartItemsElement.appendChild(li);
        });

        cartTotalElement.textContent = `${total.toFixed(2)}`;

        // Update notification number
        if (cartNotification) {
            cartNotification.textContent = totalQuantity;
            cartNotification.style.display = totalQuantity > 0 ? "block" : "none"; // Hide if cart is empty
        }

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", (event) => {
                const itemName = event.target.getAttribute("data-name");
                removeItemFromCart(itemName);
            });
        });
    }
}

// Function to remove item from the cart
function removeItemFromCart(name) {
    cart = cart.filter((item) => item.name !== name);
    updateCart();
    saveCartToLocalStorage();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add event listeners to all "Add to Cart" buttons on the menu page
document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
        const itemElement = event.target.closest(".menu-item, .bestseller, .whats-new");
        if (!itemElement) {
            console.error("Item element not found.");
            return;
        }

        const itemName = itemElement.querySelector("h3")?.textContent.trim();
        const priceText = itemElement.querySelector(".price")?.textContent;
        const itemPrice = parseFloat(priceText?.replace(/[^0-9.]/g, "")); // Extract price value safely

        if (!itemName || isNaN(itemPrice)) {
            console.error("Failed to retrieve item name or price.");
            return;
        }

        addItemToCart(itemName, itemPrice);
        alert(`${itemName} has been added to your cart!`);
    });
});

// Checkout functionality
const checkoutButton = document.getElementById("checkout-button");
if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            alert("Thank you for your purchase!");
            cart = []; // Clear the cart
            updateCart();
            saveCartToLocalStorage();
        }
    });
}

// Initial cart update on page load
updateCart();
