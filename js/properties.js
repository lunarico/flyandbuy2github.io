let currentLanguage = localStorage.getItem('selectedLanguage') || 'es';
let propertiesData = {}; // Variable para almacenar los datos del archivo JSON

document.addEventListener('DOMContentLoaded', () => {
  const languages = document.querySelector('#languages');
  const flags = document.querySelectorAll('.flag');

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
    localStorage.setItem('selectedLanguage', currentLanguage); // Almacenar el idioma seleccionado en localStorage
    loadPropertiesFromJSON(); // Cargar las propiedades desde el archivo JSON con el idioma actualizado
    updateActiveLanguageButton(); // Actualizar el botón del idioma activo
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

  // Función para obtener la descripción de la propiedad de manera asíncrona
  function getPropertyDescription(propertyName) {
    const descriptions = propertiesData.descriptions;
    const currentDescriptions = descriptions && descriptions[currentLanguage];
    return currentDescriptions && currentDescriptions[propertyName] ? currentDescriptions[propertyName] : "Descripción no disponible.";
  }

  // Función para mostrar los detalles de la propiedad en el contenedor correspondiente
  function displayPropertyDetails(propertyName) {
    const propertyDescription = getPropertyDescription(propertyName);
    const propertyDetailsContainer = document.getElementById('property-details-container');
  
    // Obtener la información de la propiedad actual desde el JSON
    const currentProperty = propertiesData.properties[getCountryFromURL()].find(prop => prop.name === propertyName);
    const { imagenes } = currentProperty;
  
    // Limpiar el contenido actual del contenedor antes de agregar el nuevo contenido
    propertyDetailsContainer.innerHTML = '';
  
    // Crear los elementos del DOM para la descripción, el slider y las miniaturas
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('property-details');
    detailsDiv.innerHTML = `
      <h3 class="propertie-title">${propertyName}</h3>
      <div class="slider-container">
        <div class="arrow left-arrow">
          <i class="fa-solid fa-caret-left"></i>
        </div>
        <div class="slider-track"></div>
        <div class="arrow right-arrow">
          <i class="fa-solid fa-caret-right"></i>
        </div>
        <div class="thumbnails-container"></div>
      </div>
      <p>${propertyDescription}</p>
    `;
  
    const imagesDiv = detailsDiv.querySelector('.slider-track');
    const thumbnailsDiv = detailsDiv.querySelector('.thumbnails-container');
  
    // Crear las imágenes y miniaturas si existen
    if (imagenes && imagenes.length > 0) {
      imagenes.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Image ${index + 1}`;
        imagesDiv.appendChild(img);
  
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        thumbnail.addEventListener('click', () => goToSlide(index));
        thumbnailsDiv.appendChild(thumbnail);
      });
    }
  
    // Agregar los elementos del DOM al contenedor principal
    propertyDetailsContainer.appendChild(detailsDiv);
  
    // Agregar la clase "properties-active" al div con ID "prop-container"
    const propContainer = document.getElementById('prop-container');
    propContainer.classList.add('properties-active');
  
    // Inicializar el slider
    initSlider();
  }

  let currentSlide = 0;

function initSlider() {
  const sliderTrack = document.querySelector('.slider-track');
  const thumbnails = document.querySelectorAll('.thumbnail');

  // Establecer la posición inicial del slider
  goToSlide(0);

  // Agregar evento click a las miniaturas para cambiar de slide
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      goToSlide(index);
    });
  });

    // Agregar evento click a las flechas para cambiar de slide
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
  
    leftArrow.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });
  
    rightArrow.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });
}

function goToSlide(index) {
  const sliderTrack = document.querySelector('.slider-track');
  const sliderWidth = sliderTrack.clientWidth;

  sliderTrack.style.transform = `translateX(-${sliderWidth * index}px)`;
  currentSlide = index;

  // Marcar la miniatura seleccionada
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumbnail, i) => {
    if (i === index) {
      thumbnail.classList.add('selected');
    } else {
      thumbnail.classList.remove('selected');
    }
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