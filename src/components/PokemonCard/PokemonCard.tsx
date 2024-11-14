import './PokemonCard.scss';
import { Pokemon } from 'pokenode-ts';
import { cards } from '../../constants/cards.ts';


interface PokemonCardProps {
  pokemon: Pokemon;
  onOpenPokedex: (pokemon: Pokemon) => void;
}

const PokemonCard = ({pokemon, onOpenPokedex}: PokemonCardProps) => {

  const handleOpenPokedex = () => {
    onOpenPokedex(pokemon);
  };

  const maxCardIndex = cards.length - 1;
  const cardIndex = Math.min(Math.floor(pokemon.base_experience / 35), maxCardIndex);
  const card = cards[cardIndex];

  return (
    <div className="pokemon-card"
         onClick={handleOpenPokedex}>
      <img className="pokemon-card-bg"
           alt=""
           src={card}/>
      <div className="pokemon-card-content">
        <img className="pokemon-image"
             src={pokemon.sprites.other?.['official-artwork'].front_default || ''}
             alt="Pokemon-Picture"/>
        <div id="Pokemon-name" className="pokemon-name">{pokemon.species.name}</div>
        <div className="pokemon-stats-container">
          <div className="pokemon-stats-title">
            <div className="pokemon-stat-title">Größe:</div>
            <div className="pokemon-stat-title">Gewicht:</div>
            <div className="pokemon-stat-title">Erfahrung:</div>
          </div>
          <div className="pokemon-stats-value">
            <div className="pokemon-stat">{pokemon.height * 10}cm</div>
            <div className="pokemon-stat">{pokemon.weight / 10}kg</div>
            <div className="pokemon-stat stat-exp">{pokemon.base_experience}</div>
          </div>
        </div>
        <div className="poke-number">#{pokemon.id.toString().padStart(3, '0')}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
