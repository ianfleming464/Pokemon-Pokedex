var pokemonRepository = (function () { //IIFE
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  var $modalContainer = document.querySelector('#modal-container');

  function add(newPokemon) {
    repository.push(newPokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $pokeList = document.querySelector('.pokemon-list'); // the ul from HTML
    var $button = document.createElement('button');
    var $listItem = document.createElement('li');
    $button.innerText = pokemon.name;
    $button.classList.add('button-class');
    $listItem.appendChild($button);
    $pokeList.appendChild($listItem);
    $button.addEventListener('click', function(event) {
      showDetails(pokemon);
    }
  );
}

function showDetails(item) {
  pokemonRepository.loadDetails(item).then(function() {
    // console.log(item);
    showModal(item);
  });
}

function loadList() {
  return fetch(apiUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    json.results.forEach(function(item) {
      var pokemon = {
        name: item.name,
        detailsUrl: item.url
      };
      add(pokemon);
    });
  }).catch(function(e) {
    console.error(e);
  });
}

function loadDetails(item) { // Loading the details from the API
  var url = item.detailsUrl;
  return fetch(url).then(function(response) {
    return response.json();
  }).then(function(details) { //Now we add the details to the items
    item.imageUrl = details.sprites.front_default;
    item.height = details.height;
    // item.types = Object.keys(details.types); //this returns an array of details
    item.types = []; // Loop to go through the types and add them, if there's more than 1
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
  }).catch(function(e) {
    console.error(e);
  });
}

function showModal(item) {
  // Clear all existing modal content

  $modalContainer.innerHTML = '';

  var modal = document.createElement('div');
  modal.classList.add('modal');

  // Makes modal appear
  $modalContainer.classList.add('is-visible');

  // Closes modal upon clicking close button
  var closeButtonElement = document.createElement('button');
  closeButtonElement.classList.add('modal-close');
  closeButtonElement.innerText = 'Close';
  closeButtonElement.style.fontFamily = 'Play';
  closeButtonElement.addEventListener('click', hideModal);

  // This will be the Pokemon's name element
  var nameElement = document.createElement('h1');
  nameElement.innerText = item.name;

  // This will be the Pokemon's height element
  var heightElement = document.createElement('p');
  heightElement.innerText = 'Height: ' + item.height;

  // Image - able for a less pixelated verision? ASK
  var imageElement = document.createElement('img');
  imageElement.classList.add('modal-img');
  imageElement.setAttribute('src', item.imageUrl);
  // Types?
  var typesElement = document.createElement('p');
  typesElement.innerText = 'Types: ' + ' ' + item.types;

  // ADding the different bits to the modal itself in the DOM
  modal.appendChild(closeButtonElement);
  modal.appendChild(nameElement);
  modal.appendChild(typesElement);
  modal.appendChild(heightElement);
  modal.appendChild(imageElement);
  $modalContainer.appendChild(modal);

  $modalContainer.classList.add('is-visible');
}

// var dialogPromiseReject; //This can be set later by showDialog

function hideModal() {
  $modalContainer.classList.remove('is-visible');

  if (dialogPromiseReject) {
    dialogPromiseReject();
    dialogPromiseReject = null;
  }
}

window.addEventListener('keydown', e => {
  if (
    e.key === 'Escape' &&
    $modalContainer.classList.contains('is-visible')
  ) {
    hideModal();
  }
});

$modalContainer.addEventListener('click', e => {
  var target = e.target;
  if (target === $modalContainer) {
    hideModal();
  }
});


return { //the keys: IIFE functions; the values: what the outside world knows them as
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  loadList: loadList,
  loadDetails: loadDetails,
  showDetails: showDetails,
  showModal: showModal,
  hideModal: hideModal

};

})();

pokemonRepository.loadList().then(function() {   // Now the data is loaded
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
 
