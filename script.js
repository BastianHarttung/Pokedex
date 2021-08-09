let allPokemon =[];
let filteredPokemon =[];
let loadedPokemon =[];

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

/* Zum Anzeigen von den Nullen vor der ID */
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }

/* Gibt Zufallszahl aus */
function getRandomPokemonId() {
    let randomNumber = Math.floor(Math.random() * 897 + 1);
    if(loadedPokemon.indexOf(randomNumber)==-1){
        loadedPokemon.push(randomNumber);
        return randomNumber;
    }else{        
        return getRandomPokemonId();
    }    
}

/* Scrolling */  
window.onscroll = function(){
    if(document.body.scrollTop > 1900|| document.documentElement.scrollTop > 1900){        
        document.getElementById('Arrow-up-button').classList.remove('d-none');
    }else{
        document.getElementById('Arrow-up-button').classList.add('d-none');
    }
}

function goToTop(){
    window.scrollTo(0,0);
}

/* On Start */
async function init() {        

    for(let i = 1; i <= 20; i++){
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}`);
        let jsonResponse = await response.json();
        allPokemon.push(jsonResponse);
    }    
    
    document.getElementById('Loading').classList.add('d-none');
    showPokecardOverview(allPokemon);
   
}

/* Pokemon Overview */
function showPokecardOverview(pokemon){        

    for (let j = 0; j < pokemon.length; j++) {         
               
        generateCards(pokemon,j);        

        document.getElementById('Pokemon-cards').innerHTML +=`
            <div class="pokemon-card" onclick="openPokedex(${j})">
                <img class="pokemon-card-bg" src='${card}'>
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
                            <div class="pokemon-stat">${pokemon[j]['height']*10}cm</div>
                            <div class="pokemon-stat">${pokemon[j]['weight']/10}kg</div>
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

function generateCards(allPokemon,j){
    if (allPokemon[j]['base_experience'] < 25) {
        card = cards[0];        
    }if (allPokemon[j]['base_experience']>= 25) {
        card = cards[1]        
    }if (allPokemon[j]['base_experience']>=50) {
        card = cards[2]        
    }if (allPokemon[j]['base_experience']>=75) {
        card = cards[3]        
    }if (allPokemon[j]['base_experience']>=100) {
        card = cards[4]        
    }if (allPokemon[j]['base_experience']>=125) {
        card = cards[5]        
    }if (allPokemon[j]['base_experience']>=150) {
        card = cards[6]        
    }if (allPokemon[j]['base_experience']>=175) {
        card = cards[7]        
    }if (allPokemon[j]['base_experience']>=200) {
        card = cards[8]        
    }if (allPokemon[j]['base_experience']>=225) {
        card = cards[9]        
    }
}


async function morePokemon(){

    let allPokemonLength = allPokemon.length+1;

    document.getElementById('Loading').classList.remove('d-none');

    for(let i = allPokemonLength; i < allPokemonLength+20; i++){
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}`);
        let jsonResponse = await response.json();
        allPokemon.push(jsonResponse);
    }    

    document.getElementById('Pokemon-cards').innerHTML ='';

    if(filteredPokemon.length==0){
        showPokecardOverview(allPokemon);
    } else{
        searchPokemon();        
    }

    document.getElementById('Loading').classList.add('d-none');
}


function numberLoadedPokemon(){
    document.getElementById('Number-loaded-pokemon').innerHTML = allPokemon.length;
    if (filteredPokemon.length > 0) {
        document.getElementById('Number-filtered-pokemon').innerHTML = filteredPokemon.length;
        document.getElementById('Number-filtered').classList.remove('d-none');
    }else{
        document.getElementById('Number-filtered').classList.add('d-none');
    }    
}

/* Search */
document.getElementById('Search-input').addEventListener('keypress', function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        searchPokemon();
    }
});

function searchPokemon(){

    let search = document.getElementById('Search-input').value;
    search = search.toLowerCase();

    if (search == '') {
            filteredPokemon = [];
            document.getElementById('Pokemon-cards').innerHTML = '';
            showPokecardOverview(allPokemon);
    }else{
        
        filteredPokemon = allPokemon.filter(allPokemon => allPokemon['species']['name'].includes(search));
        
        if(filteredPokemon.length == 0){
            document.getElementById('Pokemon-cards').innerHTML = `
                <div class="no-search-result">Leider haben wir kein Ergebnis für dich.<br>
                Bitte versuche mehr Pokemon zu laden und probiere es noch einmal.</div>
                `    

        }if(filteredPokemon.length > 0){

            document.getElementById('Pokemon-cards').innerHTML ='';

            showPokecardOverview(filteredPokemon);

        }  

        numberLoadedPokemon();
    }
} 



/* Pokedex */
function openPokedex(i){
    let pokemon;

    if (filteredPokemon.length >0) {
        pokemon = filteredPokemon;
    }else{
        pokemon = allPokemon;
    }
    
    document.getElementById('Arrow-left-container').setAttribute('onclick', `previousPokemon(${i})`);
    document.getElementById('Arrow-right-container').setAttribute('onclick', `nextPokemon(${i})`);

    let picturePokedex = pokemon[i]['sprites']['other']['dream_world']['front_default'];

    if (picturePokedex == null) {
        picturePokedex = pokemon[i]['sprites']['other']['official-artwork']['front_default'];        
    }

    document.getElementById('Pokedex-content').innerHTML =`       
            
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
                        <div class="pokedex-stat-value">${pokemon[i]['height']*10}cm</div>
                        <div class="pokedex-stat-value">${pokemon[i]['weight']/10}kg</div>
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

    showProgressBar('hp','0',i);
    showProgressBar('attack','1',i);
    showProgressBar('defense', '2',i);
    showProgressBar('speed','5',i)    

    document.getElementById('Pokedex-lightbox').classList.remove('d-none');
}

function showProgressBar(id,statsNr,i){
    document.getElementById('Stat-progress-'+id).style.width = `${allPokemon[i]['stats'][statsNr]['base_stat']}%`;
}

function closePokedex(){
    document.getElementById('Pokedex-lightbox').classList.add('d-none');
}

function nextPokemon(i){        
    let pokemonArray;

    if (filteredPokemon == 0) {
        pokemonArray = allPokemon;
    }else{
        pokemonArray = filteredPokemon;
    }

    if (i >= pokemonArray.length-1) {
        i = 0  
        openPokedex(i);      
    }else{
        openPokedex(i+1);
    }    
}

function previousPokemon(i){
    let pokemonArray;

    if (filteredPokemon == 0) {
        pokemonArray = allPokemon;
    }else{
        pokemonArray = filteredPokemon;
    }

    if (i <= 0) {
        i = pokemonArray.length-1  
        openPokedex(i);      
    }else{
        openPokedex(i-1);
    }   
}


