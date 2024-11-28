import './App.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { NamedAPIResourceList, Pokemon } from 'pokenode-ts';
import Pokeball from './assets/images/favicon_pokeball.png';
import PokemonCard from './components/PokemonCard/PokemonCard.tsx';
import Header from './components/Header/Header.tsx';
import { fetchPokemonById, fetchPokemonByName, fetchPokemonList } from './api/pokemonAPI.ts';
import Footer from './components/Footer/Footer.tsx';
import Pokedex from './components/Pokedex/Pokedex.tsx';
import Search from './components/Search/Search.tsx';
import { Sorting } from './models/enums.ts';
import { getPokemonIdRandomArray, sortPokemon } from "./helper/helper.ts";
import { Sort } from "./models/interfaces.ts";
import { GoSortAsc, GoSortDesc } from "react-icons/go";


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

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [sorting, setSorting] = useState<Sort>({sorting: Sorting.ID, direction: "asc"});

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

  const loadMorePokemons = (count: number) => {
    const fetchPromises: Promise<void>[] = []

    setIsLoading(true);

    pokemonIds.slice(0, count).forEach((pokeId: number) => {
      const fetchPromise = fetchPokemonById(pokeId)
        .then((pokemon: Pokemon) => {
          setPokemonIds((prev: number[]) => prev.filter((id) => id !== pokeId));
          setFetchedPokemons((prev: Pokemon[]) => ([...prev, pokemon]))
        })
        .catch(error => console.error(`Error fetching Id: ${pokeId}`, error))

      fetchPromises.push(fetchPromise);
    })

    Promise.allSettled(fetchPromises).then(() => {
      setIsLoading(false);
    })
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Sorting;
    setSorting(prev => ({...prev, sorting: value}));
  };

  const handleDirectionChange = () => {
    setSorting(prev => ({...prev, direction: prev.direction === "asc" ? "desc" : "asc"}));
  }

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
          setFetchedPokemons(prev => ([...prev, pokemon]))
        } else {
          setFilteredPokemons(fetchedPokemons.filter((pokemon) => pokemon.name.includes(name)))
        }
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (allPokemonCount) {
      loadMorePokemons(20);
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
    const fetchedClone = [...fetchedPokemons];
    fetchedClone.sort((a, b) => sortPokemon(a, b, sorting));
    setFilteredPokemons(fetchedClone)
  }, [sorting, fetchedPokemons]);


  return (
    <main style={{width: '100%'}}>
      <Header/>

      <section className="pokecard-overview">
        <div className="search-sorting_container">
          <Search allPokemonNames={allPokemonNames}
                  onSearchStart={handleSearch}/>

          <div className="sorting_container">
            <label htmlFor="sort">Sortieren nach</label>

            <div className="sorting-input_container">
              <select name="sort" id="sort"
                      onChange={handleSortChange}>
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {sorting.direction === "asc" ? (
                  <GoSortAsc size={24}
                             className="direction-icon"
                             title="Aktuell aufsteigend sortiert"
                             onClick={handleDirectionChange}/>)
                : <GoSortDesc size={24}
                              className="direction-icon"
                              title="Aktuell absteigend sortiert"
                              onClick={handleDirectionChange}/>}
            </div>
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
          <button onClick={() => loadMorePokemons(20)}>mehr Pokemon</button>
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

export default App;