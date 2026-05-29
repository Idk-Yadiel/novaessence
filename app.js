const WHATSAPP_NUMBER = "18296863632";

const whatsappBase = (message) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

const navbar = document.getElementById("navbar");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress?.style.setProperty("width", `${progress}%`);
  navbar?.classList.toggle("scrolled", scrollTop > 24);
  backToTop?.classList.toggle("visible", scrollTop > 520);
}

window.addEventListener("scroll", updateScrollUI);
updateScrollUI();

function openMenu() {
  sideMenu.classList.add("active");
  document.body.classList.add("menu-open");
  menuBtn.setAttribute("aria-expanded", "true");
}

function closeSideMenu() {
  sideMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", closeSideMenu);
sideMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeSideMenu);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const prevHero = document.getElementById("prevHero");
const nextHero = document.getElementById("nextHero");
let heroIndex = 0;

function showHeroSlide(index) {
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });
}

function changeHero(direction) {
  heroIndex = (heroIndex + direction + heroSlides.length) % heroSlides.length;
  showHeroSlide(heroIndex);
}

prevHero?.addEventListener("click", () => changeHero(-1));
nextHero?.addEventListener("click", () => changeHero(1));

if (heroSlides.length > 1) {
  setInterval(() => changeHero(1), 5200);
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
let countersAnimated = false;

function animateCounter(counter) {
  const finalValue = Number(counter.dataset.count);
  let frame = 0;
  const frames = 48;

  const timer = setInterval(() => {
    frame += 1;
    const progress = frame / frames;
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(finalValue * eased);

    if (frame >= frames) {
      clearInterval(timer);
      counter.textContent = finalValue;
    }
  }, 24);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(animateCounter);
      }
    });
  },
  { threshold: 0.35 }
);

if (counters.length) {
  const metricsSection = counters[0].closest(".metrics-section");

  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }
}

document.querySelectorAll(".product-order").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const product = card.dataset.product;
    const price = Number(card.dataset.price);
    const message = `Hola, quiero informacion sobre ${product}. Precio mostrado: RD$${price}.`;

    window.open(whatsappBase(message), "_blank", "noopener,noreferrer");
  });
});

const quizResult = document.getElementById("quizResult");
const quizButtons = document.querySelectorAll("[data-skin]");

const recommendations = {
  seca: {
    title: "Noche tranquila",
    text: "Enciende la vela durante un momento de descanso y acompanala con luz suave para crear un ambiente calido."
  },
  mixta: {
    title: "Tarde acogedora",
    text: "Usala en una mesa estable mientras lees, estudias o compartes una bebida caliente."
  },
  sensible: {
    title: "Regalo especial",
    text: "Combinala con una nota sencilla o una bolsa bonita para entregar un detalle artesanal con aroma a canela."
  }
};

quizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const skin = button.dataset.skin;
    const recommendation = recommendations[skin];

    quizButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (quizResult && recommendation) {
      quizResult.innerHTML = `
        <h3>${recommendation.title}</h3>
        <p>${recommendation.text}</p>
      `;
    }
  });
});

const orderForm = document.getElementById("orderForm");

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const skin = document.getElementById("customerSkin").value;
  const productSelect = document.getElementById("customerProduct");
  const product = productSelect.value;
  const price = Number(productSelect.selectedOptions[0].dataset.price);
  const orderQty = document.getElementById("orderQuantity").value;
  const comment = document.getElementById("orderComment").value.trim();
  const total = price * Number(orderQty);

  const message = [
    "Hola, quiero hacer un pedido.",
    `Nombre: ${name}`,
    `Producto: ${product}`,
    `Precio unitario: RD$${price}`,
    `Ambiente u ocasion: ${skin}`,
    `Cantidad: ${orderQty}`,
    `Total estimado: RD$${total}`,
    comment ? `Comentario: ${comment}` : "Comentario: sin comentario adicional"
  ].join("\n");

  window.open(whatsappBase(message), "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const currentItem = button.closest(".faq-item");
    const wasActive = currentItem.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    if (!wasActive) {
      currentItem.classList.add("active");
    }
  });
});
