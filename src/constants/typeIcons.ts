import BugColor from '../assets/icons/pokemon_types/bug_color.svg';
import DarkColor from '../assets/icons/pokemon_types/dark_color.svg';
import DragonColor from '../assets/icons/pokemon_types/dragon_color.svg';
import ElectricColor from '../assets/icons/pokemon_types/electric_color.svg';
import FairyColor from '../assets/icons/pokemon_types/fairy_color.svg';
import FightingColor from '../assets/icons/pokemon_types/fighting_color.svg';
import FireColor from '../assets/icons/pokemon_types/fire_color.svg';
import FlyingColor from '../assets/icons/pokemon_types/flying_color.svg';
import GhostColor from '../assets/icons/pokemon_types/ghost_color.svg';
import GrassColor from '../assets/icons/pokemon_types/grass_color.svg';
import GroundColor from '../assets/icons/pokemon_types/ground_color.svg';
import IceColor from '../assets/icons/pokemon_types/ice_color.svg';
import NormalColor from '../assets/icons/pokemon_types/normal_color.svg';
import PoisonColor from '../assets/icons/pokemon_types/poison_color.svg';
import PsychicColor from '../assets/icons/pokemon_types/psychic_color.svg';
import RockColor from '../assets/icons/pokemon_types/rock_color.svg';
import SteelColor from '../assets/icons/pokemon_types/steel_color.svg';
import WaterColor from '../assets/icons/pokemon_types/water_color.svg';
import { Pokemon } from 'pokenode-ts';


const typeIcons: Record<string, string> = {
  bug: BugColor,
  dark: DarkColor,
  dragon: DragonColor,
  electric: ElectricColor,
  fairy: FairyColor,
  fighting: FightingColor,
  fire: FireColor,
  flying: FlyingColor,
  ghost: GhostColor,
  grass: GrassColor,
  ground: GroundColor,
  ice: IceColor,
  normal: NormalColor,
  poison: PoisonColor,
  psychic: PsychicColor,
  rock: RockColor,
  steel: SteelColor,
  water: WaterColor,
};

const typeTranslations = new Map<string, string>([
  ['bug', 'Käfer'],
  ['dark', 'Dunkelheit'],
  ['dragon', 'Drache'],
  ['electric', 'Elektro'],
  ['fairy', 'Fee'],
  ['fighting', 'Kampf'],
  ['fire', 'Feuer'],
  ['flying', 'Flug'],
  ['ghost', 'Geist'],
  ['grass', 'Gras'],
  ['ground', 'Boden'],
  ['ice', 'Eis'],
  ['normal', 'Normal'],
  ['poison', 'Gift'],
  ['psychic', 'Psycho'],
  ['rock', 'Gestein'],
  ['steel', 'Stahl'],
  ['water', 'Wasser'],
]);

export const getType = (pokemon: Pokemon) => {
  const typeName = pokemon.types[0].type.name.toLowerCase();
  return typeTranslations.get(typeName) || 'Unbekannt';
};

export const getTypeIcon = (pokemon: Pokemon) => {
  return typeIcons[pokemon.types[0].type.name] || NormalColor;
};