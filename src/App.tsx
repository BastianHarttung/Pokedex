import './App.scss';
import { useState, ChangeEvent, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { FaArrowUp } from 'react-icons/fa';
import { Pokemon, NamedAPIResourceList } from 'pokenode-ts';
import Pokeball from './assets/images/favicon_pokeball.png';
import PokemonCard from './components/PokemonCard/PokemonCard.tsx';
import Header from './components/Header/Header.tsx';
import { fetchPokemonByName, fetchPokemonList, fetchPokemonsById } from './api/pokemonAPI.ts';
import Footer from './components/Footer/Footer.tsx';
import Pokedex from './components/Pokedex/Pokedex.tsx';


function App() {
  const [allPokemonList, setAllPokemonList] = useState<NamedAPIResourceList | null>(null);

  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const displayPokemon = filteredPokemon.length > 0 ? filteredPokemon : fetchedPokemons;

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [searchString, setSearchString] = useState<string>('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const handleSearch = async (search: string) => {
    if (!search) {
      setFilteredPokemon([]);
    } else {
      const result = await fetchPokemonByName(search);
      setFilteredPokemon(result ? [result] : []);
    }
  };

  const openPokedex = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsPokedexOpen(true);
  };

  const closePokedex = () => setIsPokedexOpen(false);


  const goToTop = () => {
    window.scrollTo(0, 0);
  };

  const loadMorePokemons = () => {
  };

  const searchPokemon = () => {
  };

  useEffect(() => {
    if (allPokemonList) {
      setIsLoading(true);
      fetchPokemonsById(20).then((pokemons) => {
          setFetchedPokemons(pokemons);
          setIsLoading(false);
        },
      );
    } else {
      setIsLoading(true);
      fetchPokemonList().then((list) => {
        if (list) {
          setAllPokemonList(list);
          setIsLoading(false);
        }
      });
    }
  }, [allPokemonList]);


  return (
    <main style={{width: '100%'}}>
      <Header/>

      <section className="pokecard-overview">
        <div className="search-container">
          <input id="Search-input"
                 type="text"
                 placeholder="Suche Pokemon..."
                 value={searchString}
                 onChange={handleSearchChange}/>
          <IoMdSearch size={35}
                      className="search-icon_input"
                      title="Suche starten"
                      onClick={searchPokemon}/>
        </div>

        {fetchedPokemons.length > 0 && <div className="number-loaded">
          Es sind insgesamt <span id="Number-loaded-pokemon">{fetchedPokemons.length}</span> Pokemon geladen.
        </div>}

        {/*<div id="Number-filtered"*/}
        {/*     className="number-loaded d-none">*/}
        {/*  Es wurden <span id="Number-filtered-pokemon"></span> Pokemon gefunden.*/}
        {/*</div>*/}

        <div id="Pokemon-cards"
             className="pokemon-cards-container">
          {fetchedPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id}
                         pokemon={pokemon}
                         onOpenPokedex={openPokedex}/>
          ))}
        </div>

        {isLoading && <div id="Loading"
                           className="loading">
          <img className="rotate"
               src={Pokeball}
               alt="Loading..."/>
        </div>}

        <div className="button-more-poke-container">
          <button onClick={loadMorePokemons}>mehr Pokemon</button>
        </div>

        <div id="Arrow-up-button"
             className="arrow-up-container d-none"
             onClick={goToTop}>
          <FaArrowUp/>
        </div>
      </section>

      {isPokedexOpen && <Pokedex pokemon={selectedPokemon}
                                 onClose={closePokedex}/>}

      <Footer/>
    </main>
  );
}

export default App;
