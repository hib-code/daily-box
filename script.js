// Numéro WhatsApp, sans + ni espaces
const WA_NUMBER = "212601580714";
const CURRENCY = "DH";
const GIFT_PRICE = 400;
const KID_PRICE = 200;

const PRODUCTS = [
  { id: 1, name: "Parfum femme", desc: "Parfum et miniatures", img: "./assets/p1.jpg" },
  { id: 2, name: "Parfum homme", desc: "Parfum et miniatures", img: "./assets/p2.jpg" },
  { id: 3, name: "Chocolats  premium", desc: "Assortiment artisanal", img: "./assets/p3.jpg" },
  { id: 4, name: "accessoire Femme", desc: "Trois senteurs", img: "./assets/p4.jpg" },
  { id: 5, name: "accessoire Homme", desc: "Boîte cadeau incluse", img: "./assets/p5.jpg" },
  { id: 6, name: "Montre élégante femme ", desc: "Sélection du terroir", img: "./assets/p6.jpg" },
  { id: 6, name: "Montre élégante homme ", desc: "Sélection du terroir", img: "./assets/p7.jpg" },
  { id: 7, name: "Bouquet éternel", desc: "Roses stabilisées", img: "./assets/p8.jpg" }
];

// Produits détaillés de chaque catégorie : adaptez noms, prix et images.
const DETAILS = {
  1: [
    { name: "Parfum floral", price: 120, img: "./assets/parfum-floral.jpg" },
    { name: "Parfum oriental", price: 150, img: "./assets/parfum-oriental.jpg" }
  ],
  2: [
    { name: "Chocolat noir", price: 45, img: "./assets/chocolat-noir.jpg" },
    { name: "Chocolat au lait", price: 40, img: "./assets/chocolat-lait.jpg" },
    { name: "Chocolats assortis", price: 80, img: "./assets/chocolats-assortis.jpg" }
  ],
  3: [
    { name: "Bougie vanille", price: 70, img: "./assets/bougie-vanille.jpg" },
    { name: "Bougie rose", price: 75, img: "./assets/bougie-rose.jpg" }
  ],
  4: [
    { name: "accessoire Femme", price: 250, img: "./assets/hf1.jpg" },
    { name: "Montre élégante", price: 320, img: "./assets/montre-elegante.jpg" }
  ],
  5: [
    { name: "accessoire home", price: 60, img: "./assets/hf1.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hm2.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hf3.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hm4.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hf5.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hf6.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hm7.jpeg" },
    { name: "accessoire home", price: 60, img: "./assets/hf8.jpeg" },
    { name: "accessoire home", price: 45, img: "./assets/hf9.jpeg" }
  ],
  6: [
    { name: "Bouquet de roses", price: 180, img: "./assets/roses.jpg" },
    { name: "Bouquet pastel", price: 200, img: "./assets/bouquet-pastel.jpg" }
  ]
};

const $ = id => document.getElementById(id);
const fmt = price => `${price} ${CURRENCY}`;

const GR = [
  "linear-gradient(135deg,#f9d1e0,#e98bb0)",
  "linear-gradient(135deg,#e9c9a3,#a56a3c)",
  "linear-gradient(135deg,#fbe3a3,#e0a53c)",
  "linear-gradient(135deg,#cfd8f5,#6f86d6)",
  "linear-gradient(135deg,#d7ecd0,#6fb27a)",
  "linear-gradient(135deg,#f7cdd4,#d4577a)"
];

const state = {
  v: [],
  g: false,
  k: false
};

const modal = $("productModal");
const detailsGrid = $("detailsGrid");

function imageMarkup(src, alt, fallbackEmoji) {
  if (!src) return `<span>${fallbackEmoji || "🎁"}</span>`;

  return `
    <img
      src="${src}"
      alt="${alt}"
      onerror="this.outerHTML='<span>🎁</span>'"
    >
  `;
}

// Affiche les catégories principales avec leur photo.
function buildMainProducts() {
  const grid = $("grid");
  grid.innerHTML = "";

  PRODUCTS.forEach((product, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "prod";
    card.setAttribute("aria-pressed", "false");

    card.innerHTML = `
      <div class="pic" style="--g:${GR[index % GR.length]}">
        ${imageMarkup(product.img, product.name, product.em)}
      </div>
      <b>${product.name}</b>
      <small>${product.desc}</small>
      <span class="price">Voir les produits</span>
    `;

    card.addEventListener("click", () => openProductList(product));
    grid.appendChild(card);
  });
}

// Ouvre la fenêtre des produits d'une catégorie.
function openProductList(product) {
  const items = DETAILS[product.id] || [];

  $("modalTitle").textContent = product.name;
  detailsGrid.innerHTML = "";

  if (items.length === 0) {
    detailsGrid.innerHTML = "<p>Aucun produit dans cette catégorie pour le moment.</p>";
  }

  items.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "prod detail-product";

    const selected = state.v.some(
      choice => choice.categoryId === product.id && choice.detailName === item.name
    );
    card.setAttribute("aria-pressed", String(selected));

    card.innerHTML = `
      <div class="pic" style="--g:${GR[index % GR.length]}">
        ${imageMarkup(item.img, item.name, product.em)}
      </div>
      <b>${item.name}</b>
      <span class="price">${fmt(item.price)}</span>
    `;

    card.addEventListener("click", () => {
      const selectedIndex = state.v.findIndex(
        choice => choice.categoryId === product.id && choice.detailName === item.name
      );

      if (selectedIndex >= 0) {
        state.v.splice(selectedIndex, 1);
      } else {
        state.v.push({
          categoryId: product.id,
          categoryName: product.name,
          detailName: item.name,
          name: `${product.name} – ${item.name}`,
          price: item.price,
          em: product.em
        });
      }

      updateMainSelection();
      render();
      openProductList(product);
    });

    detailsGrid.appendChild(card);
  });

  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProductList() {
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateMainSelection() {
  document.querySelectorAll("#grid .prod").forEach((card, index) => {
    const selected = state.v.some(
      item => item.categoryId === PRODUCTS[index].id
    );
    card.setAttribute("aria-pressed", String(selected));
  });
}

function total() {
  const productsTotal = state.v.reduce((sum, product) => sum + product.price, 0);
  return productsTotal
    + (state.g ? GIFT_PRICE : 0)
    + (state.k ? KID_PRICE : 0);
}

function render() {
  const productsHtml = state.v.length
    ? state.v.map(product => `
        <li>
          <span>${product.em} ${product.name}</span>
          <span>${fmt(product.price)}</span>
        </li>
      `).join("")
    : `<li><span>Produit VIP : non choisi</span><span></span></li>`;

  $("recap").innerHTML = `
    ${productsHtml}
    ${state.g ? `<li><span>🎁 Cadeau surprise</span><span>${fmt(GIFT_PRICE)}</span></li>` : ""}
    ${state.k ? `<li><span>🧸 Surprise enfant</span><span>${fmt(KID_PRICE)}</span></li>` : ""}
  `;

  $("total").textContent = fmt(total());
  $("giftPrice").textContent = fmt(GIFT_PRICE);
  $("kidPrice").textContent = fmt(KID_PRICE);
  $("navTotal").textContent = total() ? `Ma box · ${fmt(total())}` : "Ma box";
}

$("sg").addEventListener("click", () => {
  state.g = !state.g;
  $("sg").setAttribute("aria-pressed", String(state.g));
  render();
});

$("sk").addEventListener("click", () => {
  state.k = !state.k;
  $("sk").setAttribute("aria-pressed", String(state.k));
  render();
});

$("closeProducts").addEventListener("click", closeProductList);
$("closeModal").addEventListener("click", closeProductList);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeProductList();
  }
});

const ideas = {
  "Anniversaire": "Joyeux anniversaire ! Que cette nouvelle année t’apporte santé, bonheur et plein de belles surprises.",
  "Mariage": "Tous nos vœux de bonheur pour cette nouvelle vie à deux. Que votre amour grandisse chaque jour.",
  "Naissance": "Félicitations pour ce merveilleux bébé ! Beaucoup de joie et de tendresse à toute la famille.",
  "Aïd": "Aïd Mubarak Saïd ! Que Dieu accepte nos prières et comble votre foyer de paix.",
  "Remerciement": "Merci du fond du cœur. Ce petit cadeau est bien peu pour tout ce que tu fais.",
  "Juste pour faire plaisir": "Une petite attention, juste parce que tu le mérites. Pense à toi aujourd’hui."
};

$("suggest").addEventListener("click", () => {
  const recipient = $("to").value.trim();
  $("msg").value = `${recipient ? `${recipient}, ` : ""}${ideas[$("occ").value]}`;
});

$("send").addEventListener("click", () => {
  const missing = [];

  if (state.v.length === 0) missing.push("un produit VIP");
  if (!$("to").value.trim()) missing.push("le destinataire");
  if (!$("msg").value.trim()) missing.push("votre message");
  if (!$("name").value.trim()) missing.push("votre nom");
  if (!$("tel").value.trim()) missing.push("votre téléphone");
  if (!$("city").value.trim()) missing.push("la ville");

  if (missing.length) {
    $("err").textContent = "Il manque : " + missing.join(", ") + ".";
    return;
  }

  $("err").textContent = "";

  const productsText = state.v
    .map(product => `• ${product.name} (${fmt(product.price)})`)
    .join("\n");

  const message = [
    "Bonjour, je veux commander une *Daily Box Surprise VIP* :",
    "",
    "*Produits VIP*",
    productsText,
    `Cadeau surprise : ${state.g ? `oui (${fmt(GIFT_PRICE)})` : "non"}`,
    `Surprise enfant : ${state.k ? `oui (${fmt(KID_PRICE)})` : "non"}`,
    `Total : ${fmt(total())}`,
    "",
    "*Message personnalisé*",
    `Pour : ${$("to").value.trim()}`,
    `De la part de : ${$("from").value.trim() || $("name").value.trim()}`,
    `Occasion : ${$("occ").value}`,
    `Message : ${$("msg").value.trim()}`,
    "",
    "*Livraison*",
    `Nom : ${$("name").value.trim()}`,
    `Tél : ${$("tel").value.trim()}`,
    `Ville : ${$("city").value.trim()}`,
    `Adresse : ${$("addr").value.trim() || "-"}`
  ].join("\n");

  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

buildMainProducts();
render();