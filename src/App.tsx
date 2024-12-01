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
import { Sorting } from './models/enums.ts';
import { getPokemonIdRandomArray, sortPokemon } from "./helper/helper.ts";
import { Sort } from "./models/interfaces.ts";
import Toolbar from "./components/Toolbar/Toolbar.tsx";


function App() {
  const [allPokemonNames, setAllPokemonNames] = useState<string[] | null>(null);
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);

  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);

  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [searchString, setSearchString] = useState("")

  const [sorting, setSorting] = useState<Sort>({sorting: Sorting.ID, direction: "asc"});

  const [morePokemonInput, setMorePokemonInput] = useState(20)

  const openPokedex = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsPokedexOpen(true);
  };

  const closePokedex = () => setIsPokedexOpen(false);

  const goToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleChangeMoreInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setMorePokemonInput(Number(value));
  }

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
    const selectedId = filteredPokemons.findIndex((poke) => selectedPokemon?.id === poke.id)
    const nextPokemon = filteredPokemons[Math.min(selectedId + 1, filteredPokemons.length - 1)]
    setSelectedPokemon(nextPokemon)
  }

  const handlePrevPokemon = () => {
    const selectedId = filteredPokemons.findIndex((poke) => selectedPokemon?.id === poke.id)
    const prevPokemon = filteredPokemons[Math.max(selectedId - 1, 0)]
    setSelectedPokemon(prevPokemon)
  }

  const handleSearch = (search: string) => {
    setSearchString(search);
  }

  const getPokemonByName = (name: string) => {
    setIsLoading(true);
    fetchPokemonByName(name)
      .then(pokemon => {
        if (pokemon) {
          setPokemonIds(prev => prev.filter(id => id !== pokemon.id))
          setFetchedPokemons(prev => ([...prev, pokemon]))
        }
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false))
  }

  const filterPokemon = (search: string) => {
    if (!search) setFilteredPokemons(fetchedPokemons);
    else setFilteredPokemons(fetchedPokemons.filter((pokemon) => pokemon.name.includes(searchString)));
  }

  useEffect(() => {
    if (allPokemonNames) {
      loadMorePokemons(20);
    } else {
      setIsLoading(true);
      fetchPokemonList().then((list: NamedAPIResourceList | null) => {
        if (list) {
          setAllPokemonNames(list.results.map((pok) => pok.name).sort((a, b) => a.localeCompare(b)));
          setPokemonIds(getPokemonIdRandomArray(list.results));
          setIsLoading(false);
        }
      });
    }
  }, [allPokemonNames]);

  useEffect(() => {
    const isInAllPokemonNames = allPokemonNames?.includes(searchString)
    const isAlreadyFetched = fetchedPokemons.some((pokemon) => pokemon.name === searchString);

    if (isInAllPokemonNames && !isAlreadyFetched) {
      getPokemonByName(searchString)
    }
    filterPokemon(searchString)
  }, [searchString, fetchedPokemons]);

  useEffect(() => {
    const filterAndSortPokemons = () => {
      const filtered = !searchString
        ? fetchedPokemons
        : fetchedPokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchString.toLowerCase())
        );

      const sorted = [...filtered].sort((a, b) => sortPokemon(a, b, sorting));

      setFilteredPokemons(sorted);
    };

    filterAndSortPokemons();
  }, [fetchedPokemons, searchString, sorting]);


  return (
    <main style={{width: '100%'}}>
      <Header/>

      <Toolbar allPokemonNames={allPokemonNames}
               onHandleSearch={handleSearch}
               onHandleSortChange={handleSortChange}
               sorting={sorting}
               onHandleDirectionChange={handleDirectionChange}
               fetchedPokemonLength={fetchedPokemons.length}
               filteredPokemonLength={filteredPokemons.length}/>

      <section className="pokecard-overview">
        <div className="pokemon-cards-container">
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

        {pokemonIds.length > 0 && <div className="button-more-poke-container">
          <input type="number"
                 min={1}
                 max={pokemonIds.length}
                 value={morePokemonInput}
                 onChange={handleChangeMoreInput}/>
          <button onClick={() => loadMorePokemons(morePokemonInput)}>
            <span className="placeholder-input"></span> mehr Pokemon
          </button>
        </div>}

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