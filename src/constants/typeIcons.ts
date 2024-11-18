import Bug from '../assets/icons/pokemon_types/bug.svg';
import Dark from '../assets/icons/pokemon_types/dark.svg';
import Dragon from '../assets/icons/pokemon_types/dragon.svg';
import Electric from '../assets/icons/pokemon_types/electric.svg';
import Fairy from '../assets/icons/pokemon_types/fairy.svg';
import Fighting from '../assets/icons/pokemon_types/fighting.svg';
import Fire from '../assets/icons/pokemon_types/fire.svg';
import Flying from '../assets/icons/pokemon_types/flying.svg';
import Ghost from '../assets/icons/pokemon_types/ghost.svg';
import Grass from '../assets/icons/pokemon_types/grass.svg';
import Ground from '../assets/icons/pokemon_types/ground.svg';
import Ice from '../assets/icons/pokemon_types/ice.svg';
import Normal from '../assets/icons/pokemon_types/normal.svg';
import Poison from '../assets/icons/pokemon_types/poison.svg';
import Psychic from '../assets/icons/pokemon_types/psychic.svg';
import Rock from '../assets/icons/pokemon_types/rock.svg';
import Steel from '../assets/icons/pokemon_types/steel.svg';
import Water from '../assets/icons/pokemon_types/water.svg';
import { Pokemon } from 'pokenode-ts';


const typeIcons: Record<string, string> = {
  bug: Bug,
  dark: Dark,
  dragon: Dragon,
  electric: Electric,
  fairy: Fairy,
  fighting: Fighting,
  fire: Fire,
  flying: Flying,
  ghost: Ghost,
  grass: Grass,
  ground: Ground,
  ice: Ice,
  normal: Normal,
  poison: Poison,
  psychic: Psychic,
  rock: Rock,
  steel: Steel,
  water: Water,
};

export const getTypeIcon = (pokemon: Pokemon) => {
  return typeIcons[pokemon.types[0].type.name] || Normal;
};