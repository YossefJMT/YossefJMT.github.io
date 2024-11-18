'use strict';

// Función para actualizar la altura del objeto de página completa
function updateFullPageObjectHeight() {
  const fullPageObject = document.querySelector('#background');
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.offsetHeight;

  console.log('Se ha cambiado el tamaño de la ventana');
  fullPageObject.style.height = Math.max(windowHeight, documentHeight) + 'px';
}

// Función para inicializar el observador de mutaciones
function initMutationObserver() {
  const body = document.body;
  const observer = new MutationObserver(updateFullPageObjectHeight);

  observer.observe(body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

// Función para manejar las burbujas (blobs)
function handleBlobs() {
  const blobs = document.querySelectorAll('.blob');
  const minDistance = 100; // Distancia mínima entre burbujas

  function isFarEnough(newX, newY) {
    for (const blob of blobs) {
      const rect = blob.getBoundingClientRect();
      const currentX = rect.left + rect.width / 2;
      const currentY = rect.top + rect.height / 2;

      const distance = Math.sqrt((newX - currentX) ** 2 + (newY - currentY) ** 2);
      if (distance < minDistance) {
        return false; // No es suficiente distancia
      }
    }
    return true; // Es una posición válida
  }

  blobs.forEach(blob => {
    blob.addEventListener('animationiteration', () => {
      let randomX, randomY;
      do {
        // Generar posiciones aleatorias entre 5% y 95%
        randomX = Math.floor(Math.random() * (95 - 5 + 1)) + 5;
        randomY = Math.floor(Math.random() * (95 - 5 + 1)) + 5;
      } while (!isFarEnough(randomX * window.innerWidth / 100, randomY * window.innerHeight / 100));

      // Aplicar la nueva posición
      blob.style.left = `${randomX}%`;
      blob.style.top = `${randomY}%`;
    });
  });
}

// Función para alternar elementos
function elementToggleFunc(elem) { 
  elem.classList.toggle("active"); 
}

// Función para manejar la funcionalidad de la barra lateral
function handleSidebar() {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  sidebarBtn.addEventListener("click", function () { 
    elementToggleFunc(sidebar); 
  });
}

// Función para manejar los testimonios
function handleTestimonials() {
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  function testimonialsModalFunc() {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  });

  // Descomentar si se necesita la funcionalidad de cierre
  // modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  // overlay.addEventListener("click", testimonialsModalFunc);
}

// Función para manejar el selector personalizado
function handleCustomSelect() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  select.addEventListener("click", function () { 
    elementToggleFunc(this); 
  });

  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
}

// Función para filtrar elementos
function filterFunc(selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");

  filterItems.forEach(item => {
    if (selectedValue === "all" || selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Función para manejar el formulario de contacto
function handleContactForm() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
}

// Función para manejar la navegación de la página
function handlePageNavigation() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Primero, remover 'active' de todos los enlaces y páginas
      navigationLinks.forEach(navLink => navLink.classList.remove("active"));
      pages.forEach(page => page.classList.remove("active"));

      // Activar el enlace clickeado
      this.classList.add("active");

      // Activar la página correspondiente
      const targetPage = this.innerHTML.toLowerCase().trim();
      const pageToShow = document.querySelector(`[data-page="${targetPage}"]`);
      if (pageToShow) {
        pageToShow.classList.add("active");
        window.scrollTo(0, 0);
        addCardEffect();
        updateFullPageObjectHeight();
      }
    });
  });
}


// Función para añadir efecto de tarjeta
function addCardEffect() {
  const softSkillsCards = document.querySelectorAll('.card-effect');

  softSkillsCards.forEach((card) => {
    const height = card.offsetHeight || 1;
    const width = card.offsetWidth || 1;

    card.addEventListener('mousemove', (e) => {
      const { offsetX, offsetY } = e;

      const maxRotation = 30; // Grados máximos de rotación
      const yrotation = Math.min(maxRotation, Math.max(-maxRotation, 30 * ((offsetX - width / 2) / width)));
      const xrotation = Math.min(maxRotation, Math.max(-maxRotation, -30 * ((offsetY - height / 2) / height)));

      card.style.transform = `perspective(2000px) scale(0.95) rotateX(${xrotation}deg) rotateY(${yrotation}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(2000px) scale(1) rotateX(0) rotateY(0)';
    });
  });
}

// Función principal que se ejecuta cuando el DOM está completamente cargado
function initializeApp() {
  updateFullPageObjectHeight();
  initMutationObserver();
  handleBlobs();
  handleSidebar();
  handleTestimonials();
  handleCustomSelect();
  handleContactForm();
  handlePageNavigation();
  addCardEffect();

  // Agregar listener para el evento resize
  window.addEventListener('resize', updateFullPageObjectHeight);
}

// Ejecutar la función de inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);
