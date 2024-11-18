import './PokemonCard.scss';
import { Pokemon } from 'pokenode-ts';
import { cards } from '../../constants/cards.ts';
import Pokeball from '../../assets/images/favicon_pokeball.png';
import { getTypeIcon } from '../../constants/typeIcons.ts';


interface PokemonCardProps {
  pokemon: Pokemon;
  onOpenPokedex: (pokemon: Pokemon) => void;
}

const PokemonCard = ({pokemon, onOpenPokedex}: PokemonCardProps) => {
  const maxCardIndex = cards.length - 1;
  const cardIndex = Math.min(Math.floor(pokemon.base_experience / 35), maxCardIndex);
  const card = cards[cardIndex];

  const handleOpenPokedex = () => {
    onOpenPokedex(pokemon);
  };

  return (
    <div className="pokemon-card"
         onClick={handleOpenPokedex}>
      <img className="pokemon-card-bg"
           alt=""
           src={card}/>
      <div className="pokemon-card-content">

        <img src={getTypeIcon(pokemon)} alt="Pokemon Type"
             className="pokemon-type_icon"/>

        <img className="pokemon-image"
             src={pokemon.sprites.other?.['official-artwork'].front_default || Pokeball}
             alt="Pokemon-Picture"/>

        <div id="Pokemon-name" className="pokemon-name">{pokemon.species.name}</div>
        <div className="pokemon-stats-container">
          <div className="pokemon-stats-title">
            <div className="pokemon-stat-title">Größe:</div>
            <div className="pokemon-stat-title">Gewicht:</div>
            <div className="pokemon-stat-title">Erfahrung:</div>
          </div>
          <div className="pokemon-stats-value">
            <div className="pokemon-stat">{pokemon.height < 10
              ? `${pokemon.height * 10}cm`
              : `${(pokemon.height / 10).toFixed(2)}m`}</div>
            <div className="pokemon-stat">{pokemon.weight / 10}kg</div>
            <div className="pokemon-stat stat-exp">{pokemon.base_experience}</div>
          </div>
        </div>

        <div className="pokemon-stat-hp">
          {pokemon.stats[0].base_stat} HP
        </div>

        <div className={`poke-number ${pokemon.id > 9999 ? 'smaller' : ''}`}>
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
