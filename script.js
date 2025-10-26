// script.js — Drogaria Essencial Saúde (refatorado)

// -------------------------------
// Dados (demo)
const PRODUTOS = [
  { id: 1, nome: "Dipirona 500mg 20cp", cat: "medicamentos", preco: 12.9,  precoDe: 16.9, img: "https://images.unsplash.com/photo-1582719395215-12f1d2a1a5e6?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, nome: "Paracetamol 750mg 10cp", cat: "medicamentos", preco: 9.5,   img: "https://images.unsplash.com/photo-1584367369853-8b966cf2234d?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, nome: "Shampoo Neutro 250ml",   cat: "higiene",       preco: 18.9,  img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, nome: "Creme Hidratante 200g",  cat: "perfumaria",    preco: 29.9,  img: "https://images.unsplash.com/photo-1526228920375-3d7c8eac35f2?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, nome: "Fralda Infantil P (x30)",cat: "infantil",      preco: 42.9,  precoDe: 49.9, img: "https://images.unsplash.com/photo-1567113463300-102a7eb47365?q=80&w=1200&auto=format&fit=crop" },
  { id: 6, nome: "Álcool 70% 500ml",       cat: "higiene",       preco: 8.9,   img: "https://images.unsplash.com/photo-1583947581924-860bda19a8e3?q=80&w=1200&auto=format&fit=crop" }
];
const OFERTAS = [1, 5];

// -------------------------------
// Helpers
const elProdutos = document.getElementById("produtos");
const elOfertas  = document.getElementById("ofertas-grid");

const fmt = (n) => n.toFixed(2).replace(".", ",");

// Card de produto (sem JS embutido em HTML)
function card(p) {
  return `
  <div class="card shadow" data-cat="${p.cat}" data-nome="${p.nome.toLowerCase()}">
    <img src="${p.img}" alt="${p.nome}">
    <div class="body">
      <strong>${p.nome}</strong>
      <div style="display:flex;align-items:center;gap:.5rem;margin:.4rem 0">
        <span class="price">R$ ${fmt(p.preco)}</span>
        ${p.precoDe ? `<span class="strike">R$ ${fmt(p.precoDe)}</span>` : ""}
      </div>
      <div class="pill-list">
        <button class="btn small add-btn" data-id="${p.id}">Adicionar</button>
        <button class="btn small secondary whats-btn" data-name="${encodeURIComponent(p.nome)}">Comprar no WhatsApp</button>
      </div>
    </div>
  </div>`;
}

function render() {
  elProdutos.innerHTML = PRODUTOS.map(card).join("");
  elOfertas.innerHTML  = PRODUTOS.filter(p => OFERTAS.includes(p.id)).map(card).join("");
}

// -------------------------------
// Filtro e busca (usadas pelo HTML via onclick)
function filtrar(c) {
  [...elProdutos.children].forEach(card => {
    card.style.display = (c === "todos" || card.dataset.cat === c) ? "" : "none";
  });
}

function buscar() {
  const q = (document.getElementById("q").value || "").toLowerCase();
  [...elProdutos.children].forEach(card => {
    card.style.display = card.dataset.nome.includes(q) ? "" : "none";
  });
}

// -------------------------------
// Carrinho
const CART = [];

function add(prod) {
  const found = CART.find(i => i.id === prod.id);
  if (found) found.qtd++;
  else CART.push({ ...prod, qtd: 1 });
  toast("Adicionado ao carrinho");
  updateCart();
}

function abrirCart() { document.getElementById("cart").style.display = "block"; }
function fecharCart() { document.getElementById("cart").style.display = "none"; }

function updateCart() {
  document.getElementById("cart-count").textContent = CART.reduce((s, i) => s + i.qtd, 0);
  const items = document.getElementById("cart-items");
  items.innerHTML = CART.map(i => `
    <div class="row">
      <div><strong>${i.nome}</strong><div style="color:#6b7280">${i.qtd}x</div></div>
      <div>R$ ${fmt(i.qtd * i.preco)}</div>
    </div>
  `).join("");
  const total = CART.reduce((s, i) => s + i.qtd * i.preco, 0);
  document.getElementById("cart-total").textContent = "R$ " + fmt(total);
}

function checkout() {
  if (!CART.length) { toast("Carrinho vazio"); return; }
  const resumo = CART.map(i => `${i.qtd}x ${i.nome} (R$ ${fmt(i.preco)})`).join("%0A");
  const url = `https://wa.me/5517999999999?text=Olá!%20Quero%20finalizar%20meu%20pedido:%0A${resumo}`;
  window.open(url, "_blank");
}

// Compra direta via Whats do card
function whats(nome) {
  const url = `https://wa.me/5517999999999?text=Olá!%20Tenho%20interesse%20em:%20${encodeURIComponent(nome)}`;
  window.open(url, "_blank");
}

// -------------------------------
// Pedido rápido (form no HTML usa onsubmit)
function enviarPedido(e) {
  e.preventDefault();
  const f = e.target;
  const dados = {
    nome: f.nome.value.trim(),
    fone: f.fone.value.trim(),
    cep:  f.cep.value.trim(),
    itens:f.itens.value.trim()
  };
  const texto =
    `Olá!%20Sou%20${encodeURIComponent(dados.nome)}.%0A` +
    `Telefone:%20${encodeURIComponent(dados.fone)}%0A` +
    `CEP:%20${encodeURIComponent(dados.cep)}%0A` +
    `Itens:%0A${encodeURIComponent(dados.itens)}`;
  window.open("https://wa.me/5517999999999?text=" + texto, "_blank");
  toast("Pedido enviado para o WhatsApp");
  f.reset();
}

// -------------------------------
// Acessibilidade / UX
let fontScale = 0;
function ajustarFonte(step) {
  fontScale = Math.max(-2, Math.min(4, fontScale + step));
  document.documentElement.style.fontSize = (100 + fontScale * 7) + "%";
}

function toggleContraste() {
  // Aplica a classe diretamente no <body>
  document.body.classList.toggle("high-contrast");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2000);
}

// LGPD
function salvarLGPD(modo) {
  localStorage.setItem("lgpd", "ok:" + modo);
  document.getElementById("lgpdbar").style.display = "none";
  toast("Preferências salvas");
}

// -------------------------------
/* Event delegation:
   - Captura clicks nos botões de produto gerados dinamicamente
   - Evita JSON no HTML e problemas de escape
*/
document.addEventListener("click", (e) => {
  // Adicionar ao carrinho
  const addBtn = e.target.closest(".add-btn");
  if (addBtn) {
    const id = Number(addBtn.dataset.id);
    const prod = PRODUTOS.find(p => p.id === id);
    if (prod) add(prod);
    return;
  }
  // Comprar no Whats
  const whatsBtn = e.target.closest(".whats-btn");
  if (whatsBtn) {
    const nome = decodeURIComponent(whatsBtn.dataset.name || "");
    whats(nome);
    return;
  }
});

// -------------------------------
// Init
(function init() {
  render();
  document.getElementById("yy").textContent = new Date().getFullYear();
  if (!localStorage.getItem("lgpd")) {
    document.getElementById("lgpdbar").style.display = "block";
  }
})();
