import { Pokemon } from 'pokenode-ts';
import { Sorting } from "./enums.ts";


export interface PokemonWithSound extends Pokemon {
  cries: {
    latest: string | null,
    legacy: string | null
  };
}

export interface Sort {
  sorting: Sorting,
  direction: SortDirection
}

export type SortDirection = "asc" | "desc"