import './Pokedex.scss';
import PokedexBG from '../../assets/images/pokedex-bg.png';
import { Pokemon } from 'pokenode-ts';


interface PokedexProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

const Pokedex = ({pokemon, onClose}: PokedexProps) => {
  const picturePokedex = pokemon?.sprites.other?.dream_world.front_default || pokemon?.sprites.other?.
    ['official-artwork'].front_default;

  if (!pokemon) return null;

  return (
    <section id="Pokedex-lightbox"
             className="pokedex-lightbox d-none">
      <div id="Arrow-left-container"
           className="arrow-left-container buttons-continue">
        <i className="fas fa-arrow-left"
           title="Before"></i>
      </div>

      <div id="Pokedex" className="pokedex">
        <div className="background">
          <img className="pokedex-img"
               src={PokedexBG}
               alt="pokedex-bg"/>
          <div className="close-btn-container"
               onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        <div id="Pokedex-content"
             className="pokedex-content">
          {picturePokedex && <img className="pokemon-img"
                                  src={picturePokedex}
                                  alt="Leider kein Bild in der Datenbank"/>}
          <div className="pokedex-stats-container">
            <div className="pokedex-stats-title">
              <div className="pokedex-stat-title">ID</div>
              <div className="pokedex-stat-title">Name</div>
              <br/>
              <div className="pokedex-stat-title">Height</div>
              <div className="pokedex-stat-title">Weight</div>
              <div className="pokedex-stat-title">HP</div>
              <div className="pokedex-stat-title">Attack</div>
              <div className="pokedex-stat-title">Defense</div>
              <div className="pokedex-stat-title">Speed</div>
            </div>
            <div className="pokedex-stats-values">
              <div id="Pokedex-id" className="pokedex-stat-value">{pokemon.id.toString().padStart(3, '0')}</div>
              <div className="pokedex-stat-value pokedex-name">{pokemon.species.name}</div>
              <br/>
              <div className="pokedex-stat-value">{pokemon.height * 10}cm</div>
              <div className="pokedex-stat-value">{pokemon.weight / 10}kg</div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-hp"
                     className="stat-progress stat-progress-hp"
                     style={{width: `${pokemon.stats[0].base_stat}%`}}>{pokemon.stats[0].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-attack"
                     className="stat-progress stat-progress-attack"
                     style={{width: `${pokemon.stats[1].base_stat}%`}}>{pokemon.stats[1].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-defense"
                     className="stat-progress stat-progress-defense"
                     style={{width: `${pokemon.stats[2].base_stat}%`}}>{pokemon.stats[2].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-speed"
                     className="stat-progress stat-progress-speed"
                     style={{width: `${pokemon.stats[5].base_stat}%`}}>{pokemon.stats[5].base_stat}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="Arrow-right-container"
           className="arrow-right-container buttons-continue">
        <i className="fas fa-arrow-right" title="Next"></i>
      </div>
    </section>
  );
};

export default Pokedex;
