let fetchedPokemon = [];
let filteredPokemon = [];
let loadedPokemonIds = [];
let allPokemonsList = [];

let cards = [
    'img/pokecard-black.png',
    'img/pokecard-green.png',
    'img/pokecard-blue.png',
    'img/pokecard-pink.png',
    'img/pokecard-orange.png',
    'img/pokecard-yellow.png',
    'img/pokecard-purple.png',
    'img/pokecard-gold.png',
    'img/pokecard-gray.png',
    'img/pokecard-red.png',
]
let card;

/**
 * Init Fetch 20 Pokemon and show them On Start
 */
async function init() {

    for (let i = 1; i <= 20; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}`);
        let jsonResponse = await response.json();
        fetchedPokemon.push(jsonResponse);
    }

    hideLoadingSpinner();
    showPokecardOverview(fetchedPokemon);

    await fetchPokemonList()
}

/* Zum Anzeigen von den Nullen vor der ID */
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

/**
 * Give Back Random Number and save them to loadedPokemonIds
 */
function getRandomPokemonId() {
    let randomNumber = Math.floor(Math.random() * 999 + 1);
    if (loadedPokemonIds.indexOf(randomNumber) === -1) {
        loadedPokemonIds.push(randomNumber);
        return randomNumber;
    } else {
        return getRandomPokemonId();
    }
}

/* Scrolling */
window.onscroll = function () {
    if (document.body.scrollTop > 1900 || document.documentElement.scrollTop > 1900) {
        document.getElementById('Arrow-up-button').classList.remove('d-none');
    } else {
        document.getElementById('Arrow-up-button').classList.add('d-none');
    }
}

function goToTop() {
    window.scrollTo(0, 0);
}


/**
 * Fetch List of all Pokemon
 */
async function fetchPokemonList() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=3000`)
    let jsonResponse = await response.json()
    console.log(jsonResponse)
    allPokemonsList = jsonResponse.results
}

/* Pokemon Overview */
function showPokecardOverview(pokemon) {

    for (let j = 0; j < pokemon.length; j++) {

        generateCards(pokemon, j);

        document.getElementById('Pokemon-cards').innerHTML += `
            <div class="pokemon-card" onclick="openPokedex(${j})">
                <img class="pokemon-card-bg" src='${card}' alt="Card">
                <div class="pokemon-card-content">
                    <img class="pokemon-image" src="${pokemon[j]['sprites']['other']['official-artwork']['front_default']}" alt="Pokemon-Picture">
                    <div id="Pokemon-name" class="pokemon-name">${pokemon[j]['species']['name']}</div>
                    <div class="pokemon-stats-container">
                        <div class="pokemon-stats-title">
                            <div class="pokemon-stat-title">Height:</div>
                            <div class="pokemon-stat-title">Weight:</div>
                            <div class="pokemon-stat-title">Experience:</div>
                        </div>
                        <div class="pokemon-stats-value">
                            <div class="pokemon-stat">${pokemon[j]['height'] * 10}cm</div>
                            <div class="pokemon-stat">${pokemon[j]['weight'] / 10}kg</div>
                            <div class="pokemon-stat stat-exp">${pokemon[j]['base_experience']}</div>
                        </div>
                    </div>
                    <div class="poke-number">#${pokemon[j]['id'].toString().padStart(3, '0')}</div>
                </div>
            </div>
            `
    }

    numberLoadedPokemon();
}

function generateCards(allPokemon, j) {
    if (allPokemon[j]['base_experience'] < 25) {
        card = cards[0];
    }
    if (allPokemon[j]['base_experience'] >= 25) {
        card = cards[1]
    }
    if (allPokemon[j]['base_experience'] >= 50) {
        card = cards[2]
    }
    if (allPokemon[j]['base_experience'] >= 75) {
        card = cards[3]
    }
    if (allPokemon[j]['base_experience'] >= 100) {
        card = cards[4]
    }
    if (allPokemon[j]['base_experience'] >= 125) {
        card = cards[5]
    }
    if (allPokemon[j]['base_experience'] >= 150) {
        card = cards[6]
    }
    if (allPokemon[j]['base_experience'] >= 175) {
        card = cards[7]
    }
    if (allPokemon[j]['base_experience'] >= 200) {
        card = cards[8]
    }
    if (allPokemon[j]['base_experience'] >= 225) {
        card = cards[9]
    }
}

function showLoadingSpinner() {
    document.getElementById('Loading').classList.remove('d-none');
}

function hideLoadingSpinner() {
    document.getElementById('Loading').classList.add('d-none');
}

function clearResults() {
    document.getElementById('Pokemon-cards').innerHTML = '';
}

async function morePokemon() {

    let allPokemonLength = fetchedPokemon.length + 1;

    showLoadingSpinner();

    for (let i = allPokemonLength; i < allPokemonLength + 20; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}`);
        let jsonResponse = await response.json();
        fetchedPokemon.push(jsonResponse);
    }

    clearResults()

    if (filteredPokemon.length === 0) {
        showPokecardOverview(fetchedPokemon);
    } else {
        searchPokemon();
    }

    hideLoadingSpinner()
}

/**
 * Fetch Pokemon from Url
 * @param url string
 * @returns {Promise<void>}
 */
async function fetchPokemonFromList(url) {
    let response = await fetch(url);
    let jsonResponse = await response.json();
    filteredPokemon.push(jsonResponse)
}

function numberLoadedPokemon() {
    document.getElementById('Number-loaded-pokemon').innerHTML = fetchedPokemon.length.toString();
    if (filteredPokemon.length > 0) {
        document.getElementById('Number-filtered-pokemon').innerHTML = filteredPokemon.length.toString();
        document.getElementById('Number-filtered').classList.remove('d-none');
    } else {
        document.getElementById('Number-filtered').classList.add('d-none');
    }
}

/* Search */
document.getElementById('Search-input').addEventListener('keypress',
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchPokemon();
        }
    });

/**
 * Search Pokemon in fetched or in List
 * @returns {Promise<void>}
 */
async function searchPokemon() {

    let search = document.getElementById('Search-input').value;
    search = search.toLowerCase();

    showLoadingSpinner();

    if (search === '') {
        filteredPokemon = [];
        clearResults();
        showPokecardOverview(fetchedPokemon);
    } else {

        filteredPokemon = fetchedPokemon.filter(allPokemon => allPokemon['species']['name'].includes(search));

        if (filteredPokemon.length === 0) {
            const findPokemon = allPokemonsList.find((poke) => poke.name.includes(search));

            if (findPokemon) {
                clearResults();
                await fetchPokemonFromList(findPokemon.url)
                showPokecardOverview(filteredPokemon);
            } else {
                document.getElementById('Pokemon-cards').innerHTML = `
                <div class="no-search-result">Leider haben wir kein Ergebnis für dich.</div>`
            }
        }
        if (filteredPokemon.length > 0) {
            clearResults();
            showPokecardOverview(filteredPokemon);
        }

        numberLoadedPokemon();
    }

    hideLoadingSpinner()
}


/**
 * After Clicking on PokeCard open Pokedex
 */
function openPokedex(i) {
    let pokemon;

    if (filteredPokemon.length > 0) {
        pokemon = filteredPokemon;
    } else {
        pokemon = fetchedPokemon;
    }

    document.getElementById('Arrow-left-container').setAttribute('onclick', `previousPokemon(${i})`);
    document.getElementById('Arrow-right-container').setAttribute('onclick', `nextPokemon(${i})`);

    let picturePokedex = pokemon[i]['sprites']['other']['dream_world']['front_default'];

    if (picturePokedex == null) {
        picturePokedex = pokemon[i]['sprites']['other']['official-artwork']['front_default'];
    }

    document.getElementById('Pokedex-content').innerHTML = `       
            
                <img class="pokemon-img" src="${picturePokedex}" alt="Leider kein Bild in der Datenbank">
                <div class="pokedex-stats-container">
                    <div class="pokedex-stats-title">
                        <div class="pokedex-stat-title">ID</div>
                        <div class="pokedex-stat-title">Name</div>
                        <br>
                        <div class="pokedex-stat-title">Height</div>
                        <div class="pokedex-stat-title">Weight</div>
                        <div class="pokedex-stat-title">HP</div>
                        <div class="pokedex-stat-title">Attack</div>
                        <div class="pokedex-stat-title">Defense</div>
                        <div class="pokedex-stat-title">Speed</div>
                    </div>
                    <div class="pokedex-stats-values">
                        <div id="Pokedex-id" class="pokedex-stat-value">${pokemon[i]['id'].toString().padStart(3, '0')}</div>
                        <div class="pokedex-stat-value pokedex-name">${pokemon[i]['species']['name']}</div>
                        <br>
                        <div class="pokedex-stat-value">${pokemon[i]['height'] * 10}cm</div>
                        <div class="pokedex-stat-value">${pokemon[i]['weight'] / 10}kg</div>
                        <div class="pokedex-stat-value stat-progress-container">
                            <div id="Stat-progress-hp" class="stat-progress stat-progress-hp">${pokemon[i]['stats']['0']['base_stat']}</div>
                        </div>
                        <div class="pokedex-stat-value stat-progress-container">
                            <div id="Stat-progress-attack" class="stat-progress stat-progress-attack">${pokemon[i]['stats']['1']['base_stat']}</div>
                        </div>
                        <div class="pokedex-stat-value stat-progress-container">
                            <div id="Stat-progress-defense" class="stat-progress stat-progress-defense">${pokemon[i]['stats']['2']['base_stat']}</div>
                        </div>
                        <div class="pokedex-stat-value stat-progress-container">
                            <div id="Stat-progress-speed" class="stat-progress stat-progress-speed">${pokemon[i]['stats']['5']['base_stat']}</div>
                        </div>
                    </div>
                </div>            
        
        `

    showProgressBar('hp', '0', i);
    showProgressBar('attack', '1', i);
    showProgressBar('defense', '2', i);
    showProgressBar('speed', '5', i)

    document.getElementById('Pokedex-lightbox').classList.remove('d-none');
}

function showProgressBar(id, statsNr, i) {
    document.getElementById('Stat-progress-' + id).style.width = `${fetchedPokemon[i]['stats'][statsNr]['base_stat']}%`;
}

function closePokedex() {
    document.getElementById('Pokedex-lightbox').classList.add('d-none');
}

function nextPokemon(i) {
    let pokemonArray;

    if (filteredPokemon === 0) {
        pokemonArray = fetchedPokemon;
    } else {
        pokemonArray = filteredPokemon;
    }

    if (i >= pokemonArray.length - 1) {
        i = 0
        openPokedex(i);
    } else {
        openPokedex(i + 1);
    }
}

function previousPokemon(i) {
    let pokemonArray;

    if (filteredPokemon === 0) {
        pokemonArray = fetchedPokemon;
    } else {
        pokemonArray = filteredPokemon;
    }

    if (i <= 0) {
        i = pokemonArray.length - 1
        openPokedex(i);
    } else {
        openPokedex(i - 1);
    }
}


