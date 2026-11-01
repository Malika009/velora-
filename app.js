
// 1. Получаем HTML-элементы
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");

const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const favoritesBtn = document.getElementById("favoritesBtn");
const searchBtn = document.getElementById("searchBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

// 2. Массив товаров
const products = [
  {
    id: 1,
    name: "Cozy Knit Sweater",
    price: 35,
    category: "Women",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500"
  },
  {
    id: 2,
    name: "Classic Black Coat",
    price: 89,
    category: "Women",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500"
  },
  {
    id: 3,
    name: "Elegant Bag",
    price: 64,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
  },
  {
    id: 4,
    name: "White Sneakers",
    price: 72,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
  {
    id: 5,
    name: "Casual T-Shirt",
    price: 25,
    category: "Men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
  },
  {
    id: 6,
    name: "Summer Dress",
    price: 55,
    category: "Women",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500"
  },
  {
    id: 7,
    name: "Minimalist Watch",
    price: 95,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
  },
  {
    id: 8,
    name: "Leather Shoes",
    price: 110,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500"
  }
];

// 3. Корзина и избранное
let cart = [];
let favorites = [];

let currentCategory = "All";
let showFavorites = false;

// 4. Показываем товары на странице
function displayProducts(items) {
  productGrid.innerHTML = "";

  if (items.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const isFavorite = favorites.includes(product.id);

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>

        <div class="product-buttons">
          <button class="add-cart" data-id="${product.id}">
            Add to Cart
          </button>

          <button class="favorite-btn" data-id="${product.id}">
            ${isFavorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// 5. Фильтрация и поиск
function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();

  let filtered = products.filter(product => {
    const matchesCategory =
      currentCategory === "All" ||
      product.category === currentCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchValue);

    const matchesFavorites =
      !showFavorites || favorites.includes(product.id);

    return matchesCategory && matchesSearch && matchesFavorites;
  });

  displayProducts(filtered);
}

// 6. Добавляем товар в корзину
function addToCart(id) {
  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id: id,
      quantity: 1
    });
  }

  updateCart();
}

// 7. Удаляем товар из корзины
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// 8. Изменяем количество товаров
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    updateCart();
  }
}

// 9. Обновляем корзину
function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    total += product.price * item.quantity;
    count += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-product";

    cartItem.innerHTML = `
      <h3>${product.name}</h3>
      <p>$${product.price} × ${item.quantity}</p>

      <div class="quantity-controls">
        <button class="minus" data-id="${product.id}">−</button>
        <span>${item.quantity}</span>
        <button class="plus" data-id="${product.id}">+</button>
        <button class="remove" data-id="${product.id}">Remove</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartCount.textContent = count;
  cartTotal.textContent = total.toFixed(2);
}

// 10. Добавляем в избранное
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  filterProducts();
}

// 11. События для карточек товаров
productGrid.addEventListener("click", event => {
  const addButton = event.target.closest(".add-cart");
  const favoriteButton = event.target.closest(".favorite-btn");

  if (addButton) {
    addToCart(Number(addButton.dataset.id));
  }

  if (favoriteButton) {
    toggleFavorite(Number(favoriteButton.dataset.id));
  }
});

// 12. Фильтр по категориям
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    currentCategory = button.dataset.category;
    showFavorites = false;

    filterProducts();
  });
});

// 13. Поиск
searchInput.addEventListener("input", filterProducts);

// 14. Открываем корзину
cartBtn.addEventListener("click", () => {
  cartOverlay.classList.add("open");
});

// Закрываем корзину
closeCart.addEventListener("click", () => {
  cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("open");
  }
});

// 15. Управление корзиной
cartItems.addEventListener("click", event => {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("plus")) {
    changeQuantity(id, 1);
  }

  if (event.target.classList.contains("minus")) {
    changeQuantity(id, -1);
  }

  if (event.target.classList.contains("remove")) {
    removeFromCart(id);
  }
});

// 16. Показываем только избранное
favoritesBtn.addEventListener("click", () => {
  showFavorites = !showFavorites;
  currentCategory = "All";

  categoryButtons.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.category === "All"
    );
  });

  filterProducts();
});

// 17. Кнопка поиска
searchBtn.addEventListener("click", () => {
  searchInput.focus();
  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });
});

// 18. Мобильное меню
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuBtn.textContent = nav.classList.contains("active") ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

// 19. Оформление заказа
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you for shopping at Velora! 💗");

  cart = [];
  updateCart();
  cartOverlay.classList.remove("open");
});

// 20. Запускаем магазин
displayProducts(products);
updateCart();
