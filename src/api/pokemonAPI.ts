import { PokemonClient, Pokemon } from 'pokenode-ts';


const api = new PokemonClient();

export const fetchPokemonList = async () => {
  try {
    return await api.listPokemons(0, 10000);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchPokemonsById = async (count: number, ids: number[]): Promise<{
  pokemons: Pokemon[],
  remainingIds: number[]
}> => {
  const idsToFetch = ids.slice(0, count);
  const remainingIds = ids.slice(count);

  const promises = idsToFetch.map(async (id) => await api.getPokemonById(id));
  const pokemons = await Promise.all(promises);

  return {
    pokemons,
    remainingIds,
  };
};

export const fetchPokemonByName = async (name: string) => {
  try {
    return await api.getPokemonByName(name.toLowerCase());
  } catch (error) {
    console.error(error);
    return null;
  }
};
