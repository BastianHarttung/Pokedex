import { PokemonClient } from 'pokenode-ts';


const api = new PokemonClient();

export const fetchPokemonList = async () => {
  try {
    return await api.listPokemons(0,10000);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchPokemonsById = async (count: number) => {
  const promises = Array.from({length: count}, async () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    return await api.getPokemonById(randomId);
  });
  return Promise.all(promises);
};

export const fetchPokemonByName = async (name: string) => {
  try {
    return await api.getPokemonByName(name.toLowerCase());
  } catch (error) {
    console.error(error);
    return null;
  }
};
