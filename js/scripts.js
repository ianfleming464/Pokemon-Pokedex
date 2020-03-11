var pokemonRepository = (function () { //IIFE
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=75';

  function add(newPokemon) {
    repository.push(newPokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $pokeList = $('.pokemon-list'); // the ul from HTML
    var $button = $('<button type="button" class = "btn btn-primary btn-lg btn-block button-class list-group-item" data-target="#exampleModal" data-toggle="modal">' + pokemon.name + '</button>');
    var $listItem = $('<li></li>');
    $listItem.append($button);
    $pokeList.append($listItem);
    $button.on('click', function(event) {
      showDetails(pokemon);
    }
  );
}

function showDetails(item) {
  pokemonRepository.loadDetails(item).then(function() {
    console.log(item);
    showModal(item);
  });
}

function loadList() {
  return $.ajax(apiUrl, { dataType: 'json'}).then(function(json) {
    json.results.forEach(function(item) {
      var pokemon = {
        name: item.name,
        detailsUrl: item.url
      };
      add(pokemon);
      console.log(pokemon);
    });
  }).catch(function(e) {
    console.error(e);
  });
}

function loadDetails(item) { // Loading the details from the API
  var url = item.detailsUrl;
  return $.ajax(url, { dataType: 'json'}).then(function(details) { //Now we add the details to the items
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

  var modalBody = $('.modal-body');
  var modalTitle = $('.modal-title');
  modalBody.empty();
  modalTitle.empty();


  //   // Pokemon's name element
  var nameElement = $('<h1>' + item.name +'</h1>');
  //   //Pokemon's height element
  var heightElement = $('<p>' + 'Height: ' + item.height + '</p>');
  //   // Image
  var imageElement = $('<img class="modal-img">');
  imageElement.attr('src', item.imageUrl);
  //   // Pokemon's types
  var typesElement = $('<p>' + 'Types: ' + item.types + '</p>');
  //

  modalTitle.append(nameElement);
  modalBody.append(typesElement);
  modalBody.append(heightElement);
  modalBody.append(imageElement);
}
return { //the keys: IIFE functions; the values: what the outside world knows them as
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  loadList: loadList,
  loadDetails: loadDetails,
  showDetails: showDetails,
  showModal: showModal
};

})();

pokemonRepository.loadList().then(function() {   // Now the data is loaded
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// Search bar functionality
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myDIV *").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
