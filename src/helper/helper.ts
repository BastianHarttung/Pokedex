import { NamedAPIResource, Pokemon } from "pokenode-ts";
import { Sorting } from "../models/enums.ts";
import { Sort } from "../models/interfaces.ts";

export function sortPokemon(a: Pokemon, b: Pokemon, sort: Sort) {
  const isDescending = sort.direction === "desc"
  let valueA;
  let valueB;

  if (sort.sorting === Sorting.HP) {
    valueA = a.stats[0].base_stat
    valueB = b.stats[0].base_stat
  } else if (sort.sorting === Sorting.TYPE) {
    valueA = a.types[0].type.name
    valueB = b.types[0].type.name
  } else {
    valueA = a[sort.sorting];
    valueB = b[sort.sorting];
  }

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    if (isDescending) return valueB - valueA;
    else return valueA - valueB
  } else if (typeof valueA === 'string' && typeof valueB === 'string') {
    if (isDescending) return valueB.localeCompare(valueA);
    else return valueA.localeCompare(valueB);
  } else return 0;
}

export function getPokemonIdRandomArray(pokemonList: NamedAPIResource[]) {
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