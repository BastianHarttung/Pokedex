import './PokemonCard.scss';
import { Pokemon } from 'pokenode-ts';
import { cards } from '../../constants/cards.ts';


interface PokemonCardProps {
  pokemon: Pokemon;
  onOpenPokedex: (id: number) => void;
}

const PokemonCard = ({pokemon, onOpenPokedex}: PokemonCardProps) => {

  const handleOpenPokedex = () => {
    onOpenPokedex(pokemon.id);
  };

  const card = pokemon.base_experience < 35 ? cards[0]
    : pokemon.base_experience >= 35 ? cards[1]
      : pokemon.base_experience >= 70 ? cards[2]
        : pokemon.base_experience >= 105 ? cards[3]
          : pokemon.base_experience >= 140 ? cards[4]
            : pokemon.base_experience >= 175 ? cards[5]
              : pokemon.base_experience >= 210 ? cards[6]
                : pokemon.base_experience >= 245 ? cards[7]
                  : pokemon.base_experience >= 280 ? cards[8]
                    : cards[9];

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
            <div className="pokemon-stat-title">Height:</div>
            <div className="pokemon-stat-title">Weight:</div>
            <div className="pokemon-stat-title">Experience:</div>
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
