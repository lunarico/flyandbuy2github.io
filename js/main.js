// NAVBAR
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const subnavToggle = document.querySelector('.dropdown-toggle');
  const subnav = document.querySelector('.subnav');
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const nav = document.querySelector('nav')

  // CAMBIO ESTILO DE LINKS AL DESPLAZARSE POR LA PÁGINA
  function setActiveLink() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const currentSectionId = [...document.querySelectorAll('.section')]
      .find(section => {
        const sectionTop = section.offsetTop - 50;
        const sectionBottom = sectionTop + section.offsetHeight;
        return scrollPosition >= sectionTop && scrollPosition < sectionBottom;
      })
      ?.id;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSectionId);
    });
  }

  // MANEJO DE APERTURA Y CIERRE DEL SUBMENU
  function toggleSubnav(e) {
    e.preventDefault();
    const subnav = this.nextElementSibling;
    subnav.style.display = subnav.style.display === 'block' ? 'none' : 'block';
  }

  // MANEJO DE LOS LINKS
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
      if (window.innerWidth < 768) document.querySelector('.navbar').classList.remove('show');
    });
    if (link.classList.contains('dropdown-toggle')) link.addEventListener('click', toggleSubnav);
  });

  document.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // ESCONDE EL DROPDOWN DE PROPERTIES
  document.addEventListener('click', function(e) {
    const isSubnavToggle = e.target.classList.contains('dropdown-toggle');
    const isSubnav = e.target.classList.contains('subnav') || e.target.closest('.subnav');
    if (!isSubnavToggle && !isSubnav) subnav.style.display = 'none';
  });

  // NAVBAR TOGGLE
  navbarToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navbarToggle.classList.toggle('active');
    nav.classList.toggle('open-nav');
  
    if (navbarToggle.classList.contains('active')) {
      navbarToggle.classList.replace('fa-bars', 'fa-xmark');
    } else {
      navbarToggle.classList.replace('fa-xmark', 'fa-bars');
    }
  });
});


//BANDERAS

$(document).ready(function () {

  // FILTRAR PROPIEDADES POR PAÍS
  function mostrarProp(country) {
    let jsonFile = '../assets/data/properties.json';

    $.getJSON(jsonFile)
      .done(function (data) {
        const language = $(".flag:not(.flagNotSelected)").attr("data-filter");
        const properties = data.properties[country];
        const descriptions = data.descriptions[language];

        $(".properties-container").empty();

        if (properties && properties.length > 0) {
          properties.forEach((info) => {
            const description = descriptions ? descriptions[info.name] : "";
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
          const messageElement = $("<p>").text(`En este momento no contamos con propiedades en el país seleccionado.`);
          $(".properties-container").append(messageElement);
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        console.log("Error al cargar el JSON: " + textStatus + ", " + error);
      });
  }

  // ESTILO DE BANDERA SELECCIONADA
  function flagSelected() {
    var value = $(this).attr('data-filter');
    $(".flag-style").addClass('flagNotSelected');
    $(this).find(".flag-style").removeClass('flagNotSelected');

    mostrarProp(value);

    if ($(window).width() < 576) {
      const $propertiesContainer = $(".properties-container");
      $(this).after($propertiesContainer);
    }
  }
  $(".flag").click(flagSelected);

  // EVENTO CLICK PARA LAS PROPIEDADES
  $(document).on("click", ".property", function () {
    const country = $(".flag:not(.flagNotSelected)").attr("data-filter");
    const propertyName = $(this).attr("data-name");
    showPropertyDetail(country, propertyName);
  });
});

// URL PARA PROPIEDADES
function showPropertyDetail(country, propertyName) {
  const url = `../properties.html?country=${country}&property=${encodeURIComponent(propertyName)}`;
  window.location.href = url;
}


// CAMBIO LENGUAGE

const languages = document.querySelector('#languages');

// FUNCION CAMBIO DE LENGUAJE
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

// ESTILOS DE LOS BOTONES DE LENGUAJES
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