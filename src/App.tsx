import './App.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { NamedAPIResource, NamedAPIResourceList, Pokemon } from 'pokenode-ts';
import Pokeball from './assets/images/favicon_pokeball.png';
import PokemonCard from './components/PokemonCard/PokemonCard.tsx';
import Header from './components/Header/Header.tsx';
import { fetchPokemonByName, fetchPokemonList, fetchPokemonsById } from './api/pokemonAPI.ts';
import Footer from './components/Footer/Footer.tsx';
import Pokedex from './components/Pokedex/Pokedex.tsx';
import Search from './components/Search/Search.tsx';
import { Sorting } from './models/enums.ts';


const sortingOptions = [
  {value: Sorting.ID, label: 'ID #'},
  {value: Sorting.NAME, label: 'Name'},
  {value: Sorting.BASE_EXPERIENCE, label: 'Erfahrung'},
  {value: Sorting.HP, label: 'HP (Health Points)'},
  {value: Sorting.TYPE, label: 'Typ'},
  {value: Sorting.ORDER, label: 'Reihenfolge'},
  {value: Sorting.HEIGHT, label: 'Größe'},
  {value: Sorting.WEIGHT, label: 'Gewicht'},
];

function App() {
  const [allPokemonCount, setAllPokemonCount] = useState<number>(0);
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);

  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const displayPokemon = filteredPokemon.length > 0 ? filteredPokemon : fetchedPokemons;

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [sortingOrder, setSortingOrder] = useState<Sorting>(Sorting.ID);

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
    setIsLoading(true);
    fetchPokemonsById(20, pokemonIds).then(({pokemons, remainingIds}) => {
      setPokemonIds(remainingIds);
      setFetchedPokemons(prev => ([...prev, ...pokemons].sort((a, b) => sortPokemon(a, b, sortingOrder))));
      setIsLoading(false);
    });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Sorting;
    setSortingOrder(value);
  };

  useEffect(() => {
    if (allPokemonCount) {
      loadMorePokemons();
    } else {
      setIsLoading(true);
      fetchPokemonList().then((list: NamedAPIResourceList | null) => {
        if (list) {
          setAllPokemonCount(list.count);
          setAllPokemonNames(list.results.map((pok) => pok.name).sort((a, b) => a.localeCompare(b)));
          setPokemonIds(getPokemonIdRandomArray(list.results));
          setIsLoading(false);
        }
      });
    }
  }, [allPokemonCount]);

  useEffect(() => {
    setFetchedPokemons(prev => {
      const prevClone = [...prev];
      prevClone.sort((a, b) => sortPokemon(a, b, sortingOrder));
      return prevClone;
    });
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
          Es sind {fetchedPokemons.length} von {allPokemonCount} Pokemon geladen.
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

        {fetchedPokemons.length > 0 && <div className="number-loaded">
          Es sind {fetchedPokemons.length} von {allPokemonCount} Pokemon geladen.
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
  let valueA;
  let valueB;

  if (sortingOrder === Sorting.HP) {
    valueA = a.stats[0].base_stat
    valueB = b.stats[0].base_stat
  } else if (sortingOrder === Sorting.TYPE) {
    valueA = a.types[0].type.name
    valueB = b.types[0].type.name
  } else {
    valueA = a[sortingOrder];
    valueB = b[sortingOrder];
  }

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  } else if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB);
  } else return 0;
}

function getPokemonIdRandomArray(pokemonList: NamedAPIResource[]) {
  const idList = pokemonList.map(pokemon => {
    const match = pokemon.url.match(/\/pokemon\/(\d+)\//);
    return match ? parseInt(match[1], 10) : null;
  }).filter(id => id !== null);

  return shuffleArray(idList);
}

function shuffleArray(array: number[]): number[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // Swap
  }
  return result;
}

export default App;
