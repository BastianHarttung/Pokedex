import './App.scss';
import { useState, useEffect, ChangeEvent } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Pokemon, NamedAPIResourceList } from 'pokenode-ts';
import Pokeball from './assets/images/favicon_pokeball.png';
import PokemonCard from './components/PokemonCard/PokemonCard.tsx';
import Header from './components/Header/Header.tsx';
import { fetchPokemonByName, fetchPokemonList, fetchPokemonsById } from './api/pokemonAPI.ts';
import Footer from './components/Footer/Footer.tsx';
import Pokedex from './components/Pokedex/Pokedex.tsx';
import Search from './components/Search/Search.tsx';
import { Sorting } from "./models/enums.ts";


const sortingOptions = [
  {value: Sorting.ID, label: "ID #"},
  {value: Sorting.NAME, label: "Name"},
  {value: Sorting.BASE_EXPERIENCE, label: "Erfahrung"},
  {value: Sorting.ORDER, label: "Reihenfolge"},
  {value: Sorting.HEIGHT, label: "Größe"},
  {value: Sorting.WEIGHT, label: "Gewicht"},
];

function App() {
  const [allPokemonList, setAllPokemonList] = useState<NamedAPIResourceList | null>(null);
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);

  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const displayPokemon = filteredPokemon.length > 0 ? filteredPokemon : fetchedPokemons;

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [sortingOrder, setSortingOrder] = useState<Sorting>(Sorting.ID)

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

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Sorting
    setSortingOrder(value)
  }

  useEffect(() => {
    if (allPokemonList) {
      setIsLoading(true);
      fetchPokemonsById(20).then((pokemons) => {
          pokemons.sort((a, b) => sortPokemon(a, b, sortingOrder));
          setFetchedPokemons(pokemons);
          setIsLoading(false);
        },
      );
    } else {
      setIsLoading(true);
      fetchPokemonList().then((list) => {
        if (list) {
          setAllPokemonNames(list.results.map((pok) => pok.name).sort((a, b) => a.localeCompare(b)));
          setAllPokemonList(list);
          setIsLoading(false);
        }
      });
    }
  }, [allPokemonList]);

  useEffect(() => {
    setFetchedPokemons(prev => {
      const prevClone = [...prev]
      prevClone.sort((a, b) => sortPokemon(a, b, sortingOrder))
      return prevClone
    })
  }, [sortingOrder]);


  return (
    <main style={{width: '100%'}}>
      <Header/>

      <section className="pokecard-overview">
        <div className="search-sorting_container">
          <Search allPokemonNames={allPokemonNames}/>

          <div className="sorting_container">
            <label htmlFor="sort">Sortieren nach</label>
            <select name="sort" id="sort"
                    onChange={handleSortChange}>
              {sortingOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
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

function sortPokemon(a: Pokemon, b: Pokemon, sortingOrder: Sorting) {
  const valueA = a[sortingOrder];
  const valueB = b[sortingOrder];

  if (typeof valueA === "number" && typeof valueB === "number") {
    return valueA - valueB;
  } else if (typeof valueA === "string" && typeof valueB === "string") {
    return valueA.localeCompare(valueB)
  } else return 0;
}

export default App;
