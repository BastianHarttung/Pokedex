import { Pokemon } from 'pokenode-ts';
import { Sorting } from "./enums.ts";


export interface PokemonWithSound extends Pokemon {
  cries: {
    latest: string | null,
    legacy: string | null
  };
}

interface ShowdownSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
}

interface ExtendedOtherSprites extends NonNullable<Pokemon["sprites"]["other"]> {
  showdown: ShowdownSprites;
}

export interface ExtendedPokemon extends Pokemon {
  sprites: Pokemon["sprites"] & {
    other?: ExtendedOtherSprites;
  }
}

export interface Sort {
  sorting: Sorting,
  direction: SortDirection
}

export type SortDirection = "asc" | "desc"