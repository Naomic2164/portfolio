let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 6;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  if (!cart.includes(id)) {
    cart.push(id);
    saveCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item !== id);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      total += product.price;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${product.name} - $${product.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${id})">Remove</button>
      `;
      cartList.appendChild(li);
    }
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function renderProducts(list) {
  const container = document.getElementById("product-list");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = list.slice(start, end);

  container.innerHTML = pageItems.map(product => `
    <div class="product">
      <img src="${product.image || 'images/default.jpg'}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join('');

  document.getElementById("page-info").textContent = `Page ${currentPage} of ${Math.ceil(list.length / itemsPerPage)}`;
  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = end >= list.length;
}

function applyFilters() {
  const query = document.getElementById("search-box").value.toLowerCase();
  const sort = document.getElementById("sort-select").value;
  const category = document.getElementById("category-filter").value;

  filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query) &&
    (category === "" || product.category === category)
  );

  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  currentPage = 1;
  renderProducts(filteredProducts);
}

fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    renderCart();
  });

document.getElementById("search-box").addEventListener("input", applyFilters);
document.getElementById("sort-select").addEventListener("change", applyFilters);
document.getElementById("category-filter").addEventListener("change", applyFilters);
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts(filteredProducts);
  }
});
document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
    currentPage++;
    renderProducts(filteredProducts);
  }
});
document.getElementById("clear-cart").addEventListener("click", clearCart);
