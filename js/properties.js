let currentLanguage = localStorage.getItem('selectedLanguage') || 'es';
let propertiesData = {}; // Variable para almacenar los datos del archivo JSON
let text = {}; // Definir text en un ámbito más amplio

document.addEventListener('DOMContentLoaded', () => {

  const languages = document.querySelector('#languages');
  const flags = document.querySelectorAll('.flag');

  const changeLanguage = async (language) => {
    const requestJson = await fetch(`../assets/languages/${language}.json`);
    text = await requestJson.json(); 

    const toChange = document.querySelectorAll("[data-section]");

    for (const texts of toChange) {
      const section = texts.dataset.section;
      const value = texts.dataset.value;
      texts.innerHTML = text[section][value];
    }

    currentLanguage = language;
    localStorage.setItem('selectedLanguage', currentLanguage); // Almacenar el idioma seleccionado en localStorage
    loadPropertiesFromJSON(); // Cargar las propiedades desde el archivo JSON con el idioma actualizado
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

  // Función para obtener el parámetro "country" de la URL
  function getCountryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('country');
  }

  // Función para obtener el parámetro "property" de la URL
  function getPropertyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('property');
  }

   // Función para obtener las imágenes de la propiedad actual
   function getPropertyImages(propertyName) {
    const properties = propertiesData.properties;
    const country = getCountryFromURL();
    return properties[country].find(property => property.name === propertyName)?.imagenes || [];
  }

    // Función para mostrar y ocultar la barra de navegación al hacer clic en el ícono del menú
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
    
  // Función para mostrar las imágenes en el slider
  function displayPropertyImages(propertyImages) {
    const propertySliderContainer = document.getElementById('property-slider-container');
    const sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('swiper-wrapper');

    propertyImages.forEach((imageUrl) => {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.innerHTML = `<img src="${imageUrl}" alt="Property Image">`;
      sliderWrapper.appendChild(slide);
    });

    propertySliderContainer.innerHTML = '';
    propertySliderContainer.appendChild(sliderWrapper);

    // Inicializar el Swiper
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  
  // Agregar la función para mostrar las miniaturas debajo del slider
function displayMiniatureImages(images) {
  const miniatureContainer = document.querySelector('.miniature-images-container');
  miniatureContainer.innerHTML = '';

  images.forEach((imageUrl, index) => {
    const miniatureImage = document.createElement('img');
    miniatureImage.src = imageUrl;
    miniatureImage.alt = 'Miniature Image';
    miniatureImage.addEventListener('click', () => {
      swiper.slideTo(index); // Desplazar el slider a la imagen correspondiente cuando se hace clic en la miniatura
    });
    miniatureContainer.appendChild(miniatureImage);
  });
}

// Función para obtener la dirección de la propiedad
function getPropertyAddress(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.address ? propertyDescription.address : "Address not available.";
}

// Función para obtener el diseño de la propiedad
function getPropertyDesign(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.design ? propertyDescription.design : "Design not available.";
}

// Función para obtener la disponibilidad de la propiedad
function getPropertyAvailable(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.available ? propertyDescription.available : "Available not available.";
}

// Función para obtener la info de la propiedad
function getPropertyInfo(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.info ? propertyDescription.info : "Info not available.";
}

// Función para obtener la room de la propiedad
function getPropertyRooms(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.rooms ? propertyDescription.rooms : "Rooms not available.";
}

function getPropertyCharacteristics(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.characteristics ? propertyDescription.characteristics : "Characteristics not available.";
}

function getPropertyServices(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.services ? propertyDescription.services : "Rooms not available.";
}

function getPropertyCharacteristicsList(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  
  if (propertyDescription && propertyDescription.listCharacteristics) {
    return propertyDescription.listCharacteristics;
  } else {
    return ["Características no disponibles."];
  }
}

function getPropertyServicesList(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  
  if (propertyDescription && propertyDescription.listServices) {
    return propertyDescription.listServices;
  } else {
    return ["Servicios no disponibles."];
  }
}

function getPropertyButtomPdf(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.buttomPdf ? propertyDescription.buttomPdf : "Rooms not available.";
}

function getPropertyPdf(propertyName) {
  const descriptions = propertiesData.descriptions[currentLanguage];
  const propertyDescription = descriptions && descriptions[propertyName];
  return propertyDescription && propertyDescription.pdf ? propertyDescription.pdf : "Rooms not available.";
}

// Declarar swiper en un alcance más amplio
let swiper;
  // Función para mostrar los detalles de la propiedad en el contenedor correspondiente
  // Función para mostrar los detalles de la propiedad en el contenedor correspondiente

  function displayPropertyDetails(propertyName) {
    const propertyDetailsContainer = document.getElementById('property-details-container');
    propertyDetailsContainer.innerHTML = `
      <div id="logo-description">
        <img src="../assets/img/logoBlack.png" alt="Logo Fly and Buy">
        <span>
          <h1 class="title">Fly and buy</h1>
          <p class="title">Travel and real state advisor</p>
        </span>
      </div>
      <h3>${propertyName}</h3>
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper"></div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <div class="miniature-images-container"></div>
      
      <div class="property-description">
        <p class="first-description">${getPropertyAddress(propertyName)}</p>
        <hr width="1" size="500"> 
        <p class="first-description">${getPropertyDesign(propertyName)}</p>
        <hr width="1" size="500"> 
        <p class="first-description">${getPropertyAvailable(propertyName)}</p>
        <p class="more-info">${getPropertyInfo(propertyName)}</p>
        <div id="building-rooms">
          <img src="../assets/img/edificio.png" alt="Icono Edificio" class="building">
          <p class="more-info">${getPropertyRooms(propertyName)}</p>
        </div>
        <div id="char-ser">
          <div class="char">
            <h6>${getPropertyCharacteristics(propertyName)}</h6>
            <ul class="lists">
              ${getPropertyCharacteristicsList(propertyName).map(characteristic => `<li>${characteristic}</li>`).join('')}
            </ul>
          </div>
          <div class="ser">
            <h6>${getPropertyServices(propertyName)}</h6>
            <ul class="lists">
              ${getPropertyServicesList(propertyName).map(characteristic => `<li>${characteristic}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      <button id="more" class="buttom-fly" href="${getPropertyPdf(propertyName)}" download>
        <a href="${getPropertyPdf(propertyName)}" download>${getPropertyButtomPdf(propertyName)}${propertyName}</a>
      </button>
    `;
  
    const propContainer = document.getElementById('prop-container');
    propContainer.classList.add('properties-active');
  
    const properties = propertiesData.properties[getCountryFromURL()];
    const property = properties.find(prop => prop.name === propertyName);
  
    const sliderWrapper = document.querySelector('.swiper-wrapper');
  
    if (property.imagenes && property.imagenes.length > 0) {
      property.imagenes.forEach((imageUrl) => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = 'Property Image';
        slide.appendChild(image);
        sliderWrapper.appendChild(slide);
      })
    }
  
    const miniatureContainer = document.querySelector('.miniature-images-container');
  
    property.imagenes.forEach((imageUrl, index) => {
      const miniatureImage = document.createElement('img');
      miniatureImage.src = imageUrl;
      miniatureImage.alt = 'Miniature Image';
      miniatureImage.addEventListener('click', () => {
        swiper.slideTo(index);
      });
      miniatureContainer.appendChild(miniatureImage);
    });
  
    let swiper;
  
    const imagesLoadedPromises = property.imagenes.map((imageUrl) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => resolve();
        image.onerror = () => reject();
      });
    });
  
    Promise.all(imagesLoadedPromises).then(() => {
      swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

      });
  
      function adjustMiniaturesPosition() {
        if (window.innerWidth >= 576) {
          miniatureContainer.style.position = 'absolute';
          miniatureContainer.style.right = 0;
        } else {
          miniatureContainer.style.display = 'block';
          miniatureContainer.style.position = 'static';
          miniatureContainer.style.transform = 'none';
        }
      }
  
      adjustMiniaturesPosition();
  
      window.addEventListener('resize', adjustMiniaturesPosition);
    });
  }
  
  

  


  // Cargar las propiedades desde el archivo JSON
  function loadPropertiesFromJSON() {
    const country = getCountryFromURL();

    // Ruta del JSON con los datos de las propiedades
    let jsonFile = '../assets/data/properties.json';

    // Cargamos el JSON usando fetch
    fetch(jsonFile)
      .then((response) => response.json())
      .then((data) => {
        propertiesData = data; // Guardar los datos del JSON en la variable global propertiesData
        mostrarPropertiesForCountry(country);
      })
      .catch((error) => {
        console.log("Error al cargar el JSON: " + error);
      });
  }

  // Mostrar las propiedades correspondientes al país seleccionado
  function mostrarPropertiesForCountry(country) {
    const properties = propertiesData.properties[country];
    const contenidoProp = document.getElementById('contenidoProp');
    const propertyDetailsContainer = document.getElementById('property-details-container');

    contenidoProp.innerHTML = ""; // Limpiamos el contenedor antes de agregar las nuevas propiedades o el mensaje

    if (properties && properties.length > 0) {
      properties.forEach((info) => {
        const propertyElement = `
          <div class="property" data-name="${info.name}">
            <a href="?country=${country}&property=${encodeURIComponent(info.name)}">
              <img src="${info.logo}" alt="${info.name}">
            </a>
          </div>
        `;
        contenidoProp.innerHTML += propertyElement;
      });

      // Agregar el evento click a los logos de las propiedades después de mostrarlas
      const propertyLogos = document.querySelectorAll('.property a');
      propertyLogos.forEach(logo => {
        logo.addEventListener('click', function (event) {
          event.preventDefault();
          const propertyName = this.parentElement.getAttribute('data-name');
          displayPropertyDetails(propertyName);
          // Actualizar la URL para incluir el parámetro 'property'
          const url = `?country=${country}&property=${encodeURIComponent(propertyName)}`;
          window.history.replaceState({}, '', url);
        });
      });

      // Cargar los detalles de la propiedad si se especifica desde la URL
      const propertyName = getPropertyFromURL();
      if (propertyName) {
        displayPropertyDetails(propertyName);
      }
    } else {
      contenidoProp.innerHTML = "En este momento no contamos con propiedades en el país seleccionado.";
      propertyDetailsContainer.innerHTML = ""; // Limpiar el contenedor de detalles si no hay propiedades
    }
  }

  // Función para marcar una bandera como seleccionada
  function selectFlag(flag) {
    flags.forEach(f => f.classList.add('flagNotSelected'));
    flag.classList.remove('flagNotSelected');
  }

  // Función para manejar el evento de clic en una bandera
  function flagSelected() {
    const value = this.getAttribute('data-filter');
    selectFlag(this); // Marcar esta bandera como seleccionada
    mostrarPropertiesForCountry(value);

    // Si la ventana está en modo móvil (< 576px), insertar el contenedor de propiedades debajo de la bandera seleccionada
    if (window.innerWidth < 576) {
      const propertiesContainer = document.querySelector(".properties-container");
      this.after(propertiesContainer);
    }
  }

  // Agregar evento click para las banderas
  flags.forEach(flag => flag.addEventListener('click', flagSelected));

  // Cargar el idioma y las propiedades al cargar la página
  changeLanguage(currentLanguage); // Asegurarnos de que el idioma esté cargado desde el inicio

  // Obtener el país desde la URL y mostrar las propiedades correspondientes
  const country = getCountryFromURL();
  selectFlag(document.querySelector(`.flag[data-filter="${country}"]`)); // Marcar la bandera del país seleccionado
  mostrarPropertiesForCountry(country);
});