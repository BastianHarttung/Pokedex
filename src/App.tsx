import './App.scss';
import { useState } from 'react';
import { Pokemon } from './interfaces/interfaces.ts';
import Pokeball from './assets/images/favicon_pokeball.png';
import PokemonLogo from './assets/images/pokemon-logo.png';
import { IoMdSearch } from 'react-icons/io';


function App() {
  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loadedPokemonIds, setLoadedPokemonIds] = useState<string[]>([]);
  const [allPokemonList, setAllPokemonList] = useState<[]>([]);

  const showLoadingSpinner = () => {
    // document.getElementById('Loading').classList.remove('d-none');
  };

  const hideLoadingSpinner = () => {
    // document.getElementById('Loading').classList.add('d-none');
  };

  const clearResults = () => {
    // document.getElementById('Pokemon-cards').innerHTML = '';
  };

  const searchPokemon = () => {
    // let search = document.getElementById('Search-input').value;
    // search = search.toLowerCase();
    //
    // showLoadingSpinner();
    //
    // if (search === '') {
    //   filteredPokemon = [];
    //   clearResults();
    //   showPokecardOverview(fetchedPokemon);
    // } else {
    //
    //   filteredPokemon = fetchedPokemon.filter(allPokemon => allPokemon['species']['name'].includes(search));
    //
    //   if (filteredPokemon.length === 0) {
    //     const findPokemon = allPokemonsList.find((poke) => poke.name.includes(search));
    //
    //     if (findPokemon) {
    //       clearResults();
    //       await fetchPokemonFromList(findPokemon.url);
    //       showPokecardOverview(filteredPokemon);
    //     } else {
    //       document.getElementById('Pokemon-cards').innerHTML = `
    //             <div class="no-search-result">Leider haben wir kein Ergebnis für dich.</div>`;
    //     }
    //   }
    //   if (filteredPokemon.length > 0) {
    //     clearResults();
    //     showPokecardOverview(filteredPokemon);
    //   }
    //   numberLoadedPokemon();
    // }
    // hideLoadingSpinner();
  };

  const morePokemon = () => {
    // let allPokemonLength = fetchedPokemon.length + 1;
    //
    // showLoadingSpinner();
    //
    // for (let i = allPokemonLength; i < allPokemonLength + 20; i++) {
    //   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}`);
    //   let jsonResponse = await response.json();
    //   fetchedPokemon.push(jsonResponse);
    // }
    //
    // clearResults();
    //
    // if (filteredPokemon.length === 0) {
    //   showPokecardOverview(fetchedPokemon);
    // } else {
    //   searchPokemon();
    // }
    //
    // hideLoadingSpinner();
  };

  const closePokedex = () => {
    // document.getElementById('Pokedex-lightbox').classList.add('d-none');
  };

  const goToTop = () => {
    window.scrollTo(0, 0);
  };


  return (
    <>
      <header className="header">
        <div className="header-images">
          <img src={Pokeball}
               alt="pokeball"
               className="height-40"/>
          <img src={PokemonLogo}
               alt="pokemon-logo"/>
          <IoMdSearch size={40}/>
        </div>
      </header>

      <section className="pokecard-overview">

        <div className="search-container">
          <input id="Search-input"
                 type="text"
                 placeholder="Suche Pokemon..."/>
          <IoMdSearch size={40}
                      className="search-icon_input"
                      title="Suche starten"
                      onClick={searchPokemon}/>
          {/*<img onClick={searchPokemon}*/}
          {/*     className="clickable"*/}
          {/*     src="img/search.svg"*/}
          {/*     alt="Suche"*/}
          {/*     title="Suche starten"/>*/}
        </div>

        <div className="number-loaded">
          Es sind insgesamt <span id="Number-loaded-pokemon">20</span> Pokemon geladen.
        </div>

        <div id="Number-filtered"
             className="number-loaded d-none">
          Es wurden <span id="Number-filtered-pokemon"></span> Pokemon gefunden.
        </div>

        <div id="Pokemon-cards"
             className="pokemon-cards-container">
        </div>

        <div id="Loading"><img className="rotate" src="img/favicon_pokeball.png" alt="Loading..."/></div>

        <div className="button-more-poke-container">
          <button onClick={morePokemon}>mehr Pokemon</button>
        </div>

        <div id="Arrow-up-button"
             className="arrow-up-container d-none"
             onClick={goToTop}>
          <i className="fas fa-arrow-up" title="Up"></i>
        </div>

      </section>

      <section id="Pokedex-lightbox"
               className="pokedex-lightbox d-none">
        <div id="Arrow-left-container"
             className="arrow-left-container buttons-continue">
          <i className="fas fa-arrow-left"
             title="Before"></i>
        </div>

        <div id="Pokedex" className="pokedex">
          <div className="background">
            <img className="pokedex-img"
                 src="img/pokedex-bg.png"
                 alt="pokedex-bg"/>
            <div className="close-btn-container"
                 onClick={closePokedex}>
              <i className="fas fa-times"></i>
            </div>
          </div>

          <div id="Pokedex-content"
               className="pokedex-content">
          </div>
        </div>

        <div id="Arrow-right-container"
             className="arrow-right-container buttons-continue">
          <i className="fas fa-arrow-right" title="Next"></i>
        </div>
      </section>

      <footer className="footer">
        <div className="copyright">
          <div>© by Bastian Harttung</div>
          <a href="https://pokeapi.co/" target="_blank">API by Pokeapi.co</a>
        </div>
      </footer>
    </>
  );
}

export default App;
