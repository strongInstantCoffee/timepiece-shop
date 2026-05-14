const CART_KEY = "timeWorldCart";
let catalogItems = [];

const SPEC_LABELS = {
  collection: "Коллекция",
  type: "Тип часов",
  movement: "Механизм",
  case_shape: "Форма корпуса",
  glass: "Стекло",
  dial_color: "Цвет циферблата",
  strap_material: "Материал ремешка",
  strap_color: "Цвет ремешка",
  case_color: "Цвет корпуса",
  warranty: "Гарантия",
  case_material: "Материал корпуса",
  case_width: "Ширина корпуса",
  dial_type: "Тип циферблата",
  water_resistance: "Водонепроницаемость",
  strap_width: "Ширина ремешка",
  calendar: "Календарь",
  case_thickness: "Толщина корпуса"
};

const byn = (price) => `${Number(price).toLocaleString("ru-RU")} BYN`;

const safe = (text) => (text ?? "").toString();

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCounters() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach((node) => {
    node.textContent = String(count);
  });
}

function addToCart(item) {
  const cart = readCart();
  const existing = cart.find((row) => row.id === item.id);
  if (existing) existing.quantity += 1;
  else {
    cart.push({ id: item.id, name: item.name, name_ru: item.name_ru, name_by: item.name_by, price: item.price, image: item.image, quantity: 1 });
  }
  writeCart(cart);
  updateCartCounters();
}

async function loadCatalogData() {
  const response = await fetch("data.xml");
  const xmlText = await response.text();
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("Invalid XML");
  const items = Array.from(xml.querySelectorAll("item")).map((node) => {
    const get = (tag) => safe(node.querySelector(tag)?.textContent).trim();
    return {
      id: get("id"),
      name: get("name"),
      name_ru: get("name_ru"),
      name_by: get("name_by"),
      price: Number(get("price")),
      image: get("image"),
      collection: get("collection"),
      type: get("type"),
      movement: get("movement"),
      case_shape: get("case_shape"),
      glass: get("glass"),
      dial_color: get("dial_color"),
      strap_material: get("strap_material"),
      strap_color: get("strap_color"),
      case_color: get("case_color"),
      warranty: get("warranty"),
      case_material: get("case_material"),
      case_width: get("case_width"),
      dial_type: get("dial_type"),
      water_resistance: get("water_resistance"),
      strap_width: get("strap_width"),
      calendar: get("calendar"),
      case_thickness: get("case_thickness")
    };
  });
  console.log("XML loaded:", items);
  return items;
}

function createSpecs(item) {
  return Object.entries(SPEC_LABELS).map(([key, label]) => `<dt>${label}</dt><dd>${safe(item[key]) || "-"}</dd>`).join("");
}

function cardName(item) {
  return `<h3>${item.name}</h3><p class="product-card__sub">${item.name_ru}</p><p class="product-card__sub">${item.name_by}</p>`;
}

function renderCatalog(items) {
  const container = document.querySelector("#catalog-container");
  if (!container) return;
  container.innerHTML = items
    .map((item) => `
      <article class="product-card catalog-card" data-id="${item.id}" tabindex="0">
        <img src="${item.image}" alt="${item.name}">
        ${cardName(item)}
        <p class="product-card__price">${byn(item.price)}</p>
        <a class="btn-details" href="product.html?id=${item.id}">Подробнее</a>
      </article>
    `)
    .join("");
  container.querySelectorAll(".catalog-card").forEach((card) => {
    const open = () => showProductDetail(card.dataset.id);
    card.addEventListener("click", (event) => {
      if (event.target.closest(".btn-details")) return;
      open();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") open();
    });
  });
}

function showProductDetail(itemId) {
  const item = catalogItems.find((it) => it.id === String(itemId));
  const list = document.querySelector("#catalog-container");
  const panel = document.querySelector("#product-detail");
  const content = document.querySelector("#product-detail-content");
  if (!item || !list || !panel || !content) return;
  list.style.display = "none";
  panel.style.display = "block";
  content.innerHTML = `
    <article class="product-card product-card--detail">
      <img src="${item.image}" alt="${item.name}">
      ${cardName(item)}
      <p class="product-card__price">${byn(item.price)}</p>
      <dl class="specs-list">${createSpecs(item)}</dl>
      <button class="btn-primary" id="add-detail-to-cart" type="button">В корзину</button>
    </article>
  `;
  document.querySelector("#add-detail-to-cart")?.addEventListener("click", () => addToCart(item));
}

function backToCatalog() {
  const list = document.querySelector("#catalog-container");
  const panel = document.querySelector("#product-detail");
  const content = document.querySelector("#product-detail-content");
  if (!list || !panel || !content) return;
  panel.style.display = "none";
  content.innerHTML = "";
  list.style.display = "grid";
}

function initSlider() {
  const slider = document.querySelector("#promo-slider");
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".slider__dot"));
  const prev = slider.querySelector(".slider__arrow--prev");
  const next = slider.querySelector(".slider__arrow--next");
  let index = 0;
  let timer;
  const show = (value) => {
    index = (value + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  };
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 5000);
  };
  prev?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", start);
  start();
}

