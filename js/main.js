const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};


// NAVBAR

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const subnavToggle = document.querySelector('.dropdown-toggle');
  const subnav = document.querySelector('.subnav');

  function setActiveLink() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 50;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentSectionId = section.id;
        navLinks.forEach(function(link) {
          if (link.getAttribute('href').substring(1) === currentSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  function toggleSubnav(e) {
    e.preventDefault();
    const subnav = this.nextElementSibling;
    subnav.style.display = subnav.style.display === 'block' ? 'none' : 'block';
  }

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
      if (window.innerWidth < 768) {
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('show');
      }
    });

    if (link.classList.contains('dropdown-toggle')) {
      link.addEventListener('click', toggleSubnav);
    }
  });

  document.addEventListener('scroll', setActiveLink);

  setActiveLink(); // Llamar a setActiveLink al cargar la página

  function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  // Cerrar subnav si se hace clic fuera de él
  document.addEventListener('click', function(e) {
    const targetElement = e.target;
    const isSubnavToggle = targetElement.classList.contains('dropdown-toggle');
    const isSubnav = targetElement.classList.contains('subnav') || targetElement.closest('.subnav');

    if (!isSubnavToggle && !isSubnav) {
      subnav.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const nav = document.querySelector('nav');

  navbarToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.classList.toggle('active');
    nav.classList.toggle('open-nav');
    
    if (navMenu.classList.contains('active')) {
      navbarToggle.classList.replace('fa-bars', 'fa-xmark');
    } else {
      navbarToggle.classList.replace('fa-xmark', 'fa-bars');
    }
  });
});

var propLink = document.getElementsByClassName("dropdown");
var propLinkArray = Array.from(propLink);

propLinkArray.forEach(function(element) {
  element.addEventListener("click", function() {
    this.classList.toggle("open");
  });
});



// // FILTRADO BANDERAS

$(document).ready(function () {
  function mostrarProp(country) {
    // Ruta del JSON con los datos de las propiedades
    let jsonFile = '../assets/data/properties.json';

    // Cargamos el JSON usando $.getJSON
    $.getJSON(jsonFile)
      .done(function (data) {
        const language = $(".flag:not(.flagNotSelected)").attr("data-filter");
        const properties = data.properties[country];
        const descriptions = data.descriptions[language];

        // Limpiamos el contenedor antes de agregar las nuevas propiedades o el mensaje
        $(".properties-container").empty();

        if (properties && properties.length > 0) {
          // Mostramos las imágenes de las propiedades correspondientes al país seleccionado
          properties.forEach((info) => {
            // Verificamos si hay descripción para esta propiedad en el idioma seleccionado
            const description = descriptions ? descriptions[info.name] : "";
            // Agregamos el atributo "data-name" con el nombre de la propiedad
            const propertyElement = $(`
              <div class="property" data-name="${info.name}">
                <a href="/properties.html?country=${country}&property=${encodeURIComponent(info.name)}">
                  <img src=${info.logo} alt=${info.name}>
                </a>
              </div>
            `);
            $(".properties-container").append(propertyElement);
          });
        } else {
          // Si no hay propiedades disponibles, mostramos el mensaje
          const messageElement = $("<p>").text(`En este momento no contamos con propiedades en el país seleccionado.`);
          $(".properties-container").append(messageElement);
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        console.log("Error al cargar el JSON: " + textStatus + ", " + error);
      });
  }

  function flagSelected() {
    var value = $(this).attr('data-filter');

    $(".flag-style").addClass('flagNotSelected');
    $(this).find(".flag-style").removeClass('flagNotSelected');

    mostrarProp(value);

    // Si la ventana está en modo móvil (< 576px), insertar el contenedor de propiedades debajo de la bandera seleccionada
    if ($(window).width() < 576) {
      const $propertiesContainer = $(".properties-container");
      $(this).after($propertiesContainer);
    }
  }

  $(".flag").click(flagSelected);

  // Agregar evento click para las propiedades
  $(document).on("click", ".property", function () {
    const country = $(".flag:not(.flagNotSelected)").attr("data-filter");
    const propertyName = $(this).attr("data-name");
    showPropertyDetail(country, propertyName);
  });
});

// Función para mostrar detalles de propiedad
function showPropertyDetail(country, propertyName) {
  // Construir URL con el nombre de la propiedad y redirigir
  const url = `../properties.html?country=${country}&property=${encodeURIComponent(propertyName)}`;
  window.location.href = url;
}

// CAMBIO LENGUAGE

const languages = document.querySelector('#languages');

const changeLanguage = async (language) => {
  const requestJson = await fetch(`../assets/languages/${language}.json`);
  const text = await requestJson.json();

  const toChange = document.querySelectorAll("[data-section]");

  for (const texts of toChange) {
    const section = texts.dataset.section;
    const value = texts.dataset.value;
    texts.innerHTML = text[section][value];
  }

  currentLanguage = language;
  localStorage.setItem('selectedLanguage', language); // Guardar el idioma seleccionado en localStorage
  loadPropertyFromURL(); // Cargar la propiedad desde la URL actualizada
};


languages.addEventListener('click', (e) => {
  changeLanguage(e.target.parentElement.dataset.language);
});

let buttonLanguage = document.getElementsByClassName("button-language");

function buttonSelected() {
  for (var i = 0; i < buttonLanguage.length; i++) {
    buttonLanguage[i].classList.remove('button-active');
  }
  this.classList.add('button-active');
}

for (var i = 0; i < buttonLanguage.length; i++) {
  buttonLanguage[i].addEventListener("click", buttonSelected);
}