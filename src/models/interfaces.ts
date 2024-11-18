import { Pokemon } from 'pokenode-ts';


export interface PokemonWithSound extends Pokemon {
  cries: {
    latest: string | null,
    legacy: string | null
  };
}