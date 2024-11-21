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
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  // const displayPokemon = filteredPokemon.length > 0 ? filteredPokemon : fetchedPokemons;

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [sortingOrder, setSortingOrder] = useState<Sorting>(Sorting.ID);

  const handleSearch = (search: string) => {
    if (!search) {
      setFilteredPokemons(fetchedPokemons);
    } else {
      const findPokemon = fetchedPokemons.find(poke => poke.name === search);
      if (findPokemon) {
        setFilteredPokemons(fetchedPokemons.filter((pokemon) => pokemon.name.includes(search)));
      } else {
        getPokemonByName(search)
      }
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
    fetchPokemonsById(20, pokemonIds)
      .then(({pokemons, remainingIds}) => {
        setPokemonIds(remainingIds);
        setFetchedPokemons(prev => ([...prev, ...pokemons].sort((a, b) => sortPokemon(a, b, sortingOrder))));
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false))
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Sorting;
    setSortingOrder(value);
  };

  const handleNextPokemon = () => {
    const selectedId = fetchedPokemons.findIndex((poke) => selectedPokemon?.id === poke.id)
    const nextPokemon = fetchedPokemons[Math.min(selectedId + 1, fetchedPokemons.length - 1)]
    setSelectedPokemon(nextPokemon)
  }

  const handlePrevPokemon = () => {
    const selectedId = fetchedPokemons.findIndex((poke) => selectedPokemon?.id === poke.id)
    const nextPokemon = fetchedPokemons[Math.max(selectedId - 1, 0)]
    setSelectedPokemon(nextPokemon)
  }

  const getPokemonByName = (name: string) => {
    setIsLoading(true);
    fetchPokemonByName(name)
      .then(pokemon => {
        if (pokemon) {
          setPokemonIds(prev => prev.filter(id => id !== pokemon.id))
          setFetchedPokemons(prev => ([...prev, pokemon].sort((a, b) => sortPokemon(a, b, sortingOrder))))
        } else {
          setFilteredPokemons(fetchedPokemons.filter((pokemon) => pokemon.name.includes(name)))
        }
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false))
  }

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

  useEffect(() => {
    setFilteredPokemons(fetchedPokemons)
  }, [fetchedPokemons]);


  return (
    <main style={{width: '100%'}}>
      <Header/>

      <section className="pokecard-overview">
        <div className="search-sorting_container">
          <Search allPokemonNames={allPokemonNames}
                  onSearchStart={handleSearch}/>

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

        {fetchedPokemons.length !== filteredPokemons.length && (
          <div id="Number-filtered"
               className="number-loaded d-none">
            Es wurde{filteredPokemons.length > 1 ? "n" : ""} {filteredPokemons.length} Pokemon gefunden.
          </div>
        )}

        {fetchedPokemons.length > 0 && <div className="number-loaded">
          Es sind {fetchedPokemons.length} von {allPokemonCount} Pokemon geladen.
        </div>
        }

        <div id="Pokemon-cards"
             className="pokemon-cards-container">
          {filteredPokemons.map((pokemon) => (
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
                                 onClose={closePokedex}
                                 onNextPokemon={handleNextPokemon}
                                 onPrevPokemon={handlePrevPokemon}/>}

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
