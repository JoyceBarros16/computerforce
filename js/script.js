document.addEventListener("DOMContentLoaded", () => {
  // Mobile toggles
  const menuBtn = document.querySelector("[data-menu-btn]");
  const bagBtn = document.querySelector("[data-bag-btn]");
  const menuLinks = document.querySelector("[data-menu-links]");
  const searchArea = document.querySelector("[data-search-area]");
  const asidePanel = document.querySelector("[data-aside-panel]");

  if (menuBtn && menuLinks && searchArea) {
    menuBtn.addEventListener("click", () => {
      menuLinks.classList.toggle("is-open");
      searchArea.classList.toggle("is-open");
    });
  }

  if (bagBtn && asidePanel) {
    bagBtn.addEventListener("click", () => {
      asidePanel.classList.toggle("is-open");
    });
  }

  // --- SEARCH: go to PRODUCT (not just category) ---
const searchForm = document.querySelector("[data-search-form]");

const PRODUCT_INDEX = [
  // AUDIO
  { id: "aud-headphones", name: "Wireless Headphones", page: "categories/audio.html" },
  { id: "aud-speaker", name: "Bluetooth Speaker", page: "categories/audio.html" },
  { id: "aud-mic", name: "USB Microphone", page: "categories/audio.html" },

  // COMPUTERS
  { id: "pc-gaming", name: "Gaming PC - RTX Ready", page: "categories/computers.html" },
  { id: "pc-office", name: "Office Desktop i5", page: "categories/computers.html" },
  { id: "pc-mini", name: "Mini PC Compact", page: "categories/computers.html" },

  // GRAPHICS
  { id: "gpu-8gb", name: "8GB Graphics Card", page: "categories/graphicscards.html" },
  { id: "gpu-12gb", name: "12GB Graphics Card", page: "categories/graphicscards.html" },
  { id: "gpu-16gb", name: "16GB Graphics Card", page: "categories/graphicscards.html" },

  // KEYBOARDS + MICE
  { id: "km-mech", name: "Mechanical Keyboard", page: "categories/keyboards-mice.html" },
  { id: "km-wireless", name: "Wireless Mouse", page: "categories/keyboards-mice.html" },
  { id: "km-gaming", name: "Gaming Mouse", page: "categories/keyboards-mice.html" },

  // LAPTOPS
  { id: "lap-ultra", name: 'Ultrabook 13"', page: "categories/laptops.html" },
  { id: "lap-gaming", name: 'Gaming Laptop 15"', page: "categories/laptops.html" },
  { id: "lap-student", name: 'Student Laptop 14"', page: "categories/laptops.html" },

  // MONITORS
  { id: "mon-24", name: '24" Full HD Monitor', page: "categories/monitors.html" },
  { id: "mon-27", name: '27" QHD Monitor', page: "categories/monitors.html" },
  { id: "mon-34", name: '34" Ultrawide', page: "categories/monitors.html" },

  // NETWORKING
  { id: "net-router", name: "Wi-Fi Router", page: "categories/networking.html" },
  { id: "net-switch", name: "8-Port Switch", page: "categories/networking.html" },
  { id: "net-extender", name: "Wi-Fi Extender", page: "categories/networking.html" },

  // PERIPHERALS
  { id: "per-webcam", name: "HD Webcam", page: "categories/peripherals.html" },
  { id: "per-hdd", name: "External HDD 2TB", page: "categories/peripherals.html" },
  { id: "per-hub", name: "USB-C Hub", page: "categories/peripherals.html" },

  // PRINTING
  { id: "ps-inkjet", name: "Inkjet Printer", page: "categories/printing-scanning.html" },
  { id: "ps-laser", name: "Laser Printer", page: "categories/printing-scanning.html" },
  { id: "ps-scanner", name: "Document Scanner", page: "categories/printing-scanning.html" },

  // SOFTWARE
  { id: "soft-office", name: "Office Suite (1 year)", page: "categories/software.html" },
  { id: "soft-av", name: "Antivirus (1 year)", page: "categories/software.html" },
  { id: "soft-photo", name: "Photo Editor (license)", page: "categories/software.html" },

  // STORAGE
  { id: "stor-ssd", name: "SSD 1TB", page: "categories/storage.html" },
  { id: "stor-hdd", name: "HDD 4TB", page: "categories/storage.html" },
  { id: "stor-usb", name: "USB Flash 128GB", page: "categories/storage.html" },

  // TABLETS
  { id: "tab-10", name: 'Tablet 10" Wi-Fi', page: "categories/tablets.html" },
  { id: "tab-11", name: 'Tablet 11" LTE', page: "categories/tablets.html" },
  { id: "tab-mini", name: 'Mini Tablet 8"', page: "categories/tablets.html" },
];

// resolve site root even if you are inside /categories or /joyce
const getSiteRoot = () => {
  const url = window.location.href;
  if (url.includes("/categories/")) return url.split("/categories/")[0];
  if (url.includes("/joyce/")) return url.split("/joyce/")[0];
  return url.replace(/\/[^\/]*$/, ""); // current folder
};

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = searchForm.querySelector("input")?.value?.trim().toLowerCase();
    if (!term) return;

    const found = PRODUCT_INDEX.find(p =>
      p.name.toLowerCase().includes(term) || term.includes(p.name.toLowerCase())
    ) || PRODUCT_INDEX.find(p =>
      p.name.toLowerCase().split(" ").some(word => term.includes(word))
    );

    if (!found) return alert("Product not found.");

    const root = getSiteRoot();
    window.location.href = `${root}/${found.page}?p=${encodeURIComponent(found.id)}`;
  });
}

// On category page: scroll to product if ?p=...
const params = new URLSearchParams(window.location.search);
const pid = params.get("p");
if (pid) {
  const el = document.getElementById(pid) || document.querySelector(`[data-id="${pid}"]`)?.closest(".product");
  if (el) {
    el.classList.add("highlight");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

  // CART (localStorage)
  const CART_KEY = "cf_cart_v1";

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  };

  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const addToCart = (item) => {
    const cart = getCart();
    const existing = cart.find(p => p.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    saveCart(cart);
    renderCart();
  };

  const removeOne = (id) => {
    const cart = getCart();
    const idx = cart.findIndex(p => p.id === id);
    if (idx === -1) return;
    cart[idx].qty -= 1;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  };

  const clearCart = () => {
    saveCart([]);
    renderCart();
  };

  const formatAUD = (n) => `$${Number(n).toFixed(2)}`;

  const renderCart = () => {
    const tbody = document.getElementById("cart-items");
    if (!tbody) return;

    const cart = getCart();
    if (cart.length === 0) {
      tbody.innerHTML = `<tr><td>0 items</td><td>Cart sub-total: $0</td></tr>`;
      return;
    }

    let subtotal = 0;
    let itemsCount = 0;

    const rows = cart.map(p => {
      subtotal += p.price * p.qty;
      itemsCount += p.qty;

      return `
        <tr>
          <td>
            ${p.name}<br>
            <small>Qty: ${p.qty}</small>
            <div><button class="cart-remove" type="button" data-remove="${p.id}">Remove</button></div>
          </td>
          <td>${formatAUD(p.price * p.qty)}</td>
        </tr>
      `;
    }).join("");

    const summary = `
      <tr>
        <td><strong>${itemsCount} item(s)</strong></td>
        <td><strong>Sub-total: ${formatAUD(subtotal)}</strong></td>
      </tr>
    `;

    tbody.innerHTML = rows + summary;

    tbody.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => removeOne(btn.getAttribute("data-remove")));
    });
  };

  // Buttons
  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

// CHECKOUT DEMO
const checkoutBtn = document.getElementById("checkout-btn");

const openCheckout = () => {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Calculate order total and quantity
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty, 0
  );

  const itemsCount = cart.reduce(
    (sum, item) => sum + item.qty, 0
  );

  // Create checkout dialog
  const modal = document.createElement("dialog");
  modal.className = "checkout-modal";
  modal.setAttribute("aria-labelledby", "checkout-title");

  modal.innerHTML = `
    <div class="checkout-header">
      <h2 id="checkout-title">Order Summary</h2>
      <button type="button" class="checkout-close"
        aria-label="Close checkout">&times;</button>
    </div>

    <p class="checkout-intro">
      Review your items before confirming your order.
    </p>

    <div class="checkout-items"></div>

    <div class="checkout-summary">
      <p>Items: <strong>${itemsCount}</strong></p>
      <h3>Total (AUD): ${formatAUD(total)}</h3>
    </div>

    <button type="button" class="checkout-btn confirm-order">
      Confirm Order
    </button>

    <button type="button" class="checkout-cancel">
      Continue Shopping
    </button>

    <p class="checkout-note">
      Demonstration only. No payment will be processed.
    </p>
  `;

  // Display cart items safely
  const itemsContainer = modal.querySelector(".checkout-items");

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "checkout-item";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    const quantity = document.createElement("small");
    const price = document.createElement("strong");

    name.textContent = item.name;
    quantity.textContent =
      `Qty: ${item.qty} × ${formatAUD(item.price)}`;
    price.textContent = formatAUD(item.price * item.qty);

    details.append(name, quantity);
    row.append(details, price);
    itemsContainer.appendChild(row);
  });

  document.body.appendChild(modal);

  // Remove dialog after closing
  modal.addEventListener("close", () => {
    modal.remove();
    checkoutBtn.focus();
  });

  modal.querySelector(".checkout-close")
    .addEventListener("click", () => modal.close());

  modal.querySelector(".checkout-cancel")
    .addEventListener("click", () => modal.close());

  // Confirm the simulated order
  modal.querySelector(".confirm-order")
    .addEventListener("click", () => {
      clearCart();

      modal.innerHTML = `
        <div class="checkout-success">
          <div class="success-icon" aria-hidden="true">✓</div>

          <h2 id="checkout-title">Order Successful!</h2>

          <p>Thank you for shopping with ComputerForce.</p>

          <p>Your demo order has been confirmed.</p>

          <button type="button" class="checkout-btn finish-order">
            Continue Shopping
          </button>

          <p class="checkout-note">
            No payment has been processed.
          </p>
        </div>
      `;

      const finishBtn = modal.querySelector(".finish-order");

      finishBtn.addEventListener("click", () => modal.close());
      finishBtn.focus();
    });

  modal.showModal();
};

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", openCheckout);
}


  // Hook: Add buttons on category pages
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = Number(btn.getAttribute("data-price"));
      addToCart({ id, name, price });
    });
  });

  renderCart();
});
// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu-left");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}