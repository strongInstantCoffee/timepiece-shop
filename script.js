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

