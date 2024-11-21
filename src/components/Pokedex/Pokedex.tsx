import './Pokedex.scss';
import PokedexBG from '../../assets/images/pokedex-bg.png';
import { Pokemon } from 'pokenode-ts';
import { PokemonWithSound } from '../../models/interfaces.ts';
import { useEffect, useState } from 'react';
import { getTypeIcon, getType } from '../../constants/typeIcons.ts';


interface PokedexProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  onNextPokemon: () => void;
  onPrevPokemon: () => void;
}

const Pokedex = ({pokemon, onClose, onNextPokemon, onPrevPokemon}: PokedexProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const picturePokedex = pokemon?.sprites.other?.dream_world.front_default || pokemon?.sprites.other?.
    ['official-artwork'].front_default;

  const maxStat = Math.max(pokemon?.stats[0].base_stat || 0,
    pokemon?.stats[1].base_stat || 0,
    pokemon?.stats[2].base_stat || 0,
    pokemon?.stats[5].base_stat || 0,
    100);

  const pokemonWithSound = pokemon as PokemonWithSound;

  const pokemonSounds = [pokemonWithSound?.cries?.latest, pokemonWithSound?.cries?.legacy].filter(sound => sound !== null);

  const handleAudioPlay = () => {
    if (!isAudioPlaying) {
      const randomIndex = Math.floor(Math.random() * pokemonSounds.length);
      const audio = new Audio(pokemonSounds[randomIndex]);
      audio.volume = 0.2;
      audio.addEventListener('playing', () => setIsAudioPlaying(true));
      audio.addEventListener('ended', () => setIsAudioPlaying(false));
      audio.addEventListener('error', () => setIsAudioPlaying(false));
      audio.play()
        .catch((err) => {
          setIsAudioPlaying(false);
          console.error('Error playing sound', err);
        });
    }
  };

  useEffect(() => {
    if(pokemon) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [pokemon]);


  if (!pokemon) return null;

  return (
    <section id="Pokedex-lightbox"
             className="pokedex-lightbox d-none">
      <div id="Arrow-left-container"
           className="arrow-left-container buttons-continue"
           onClick={onPrevPokemon}>
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

          <img src={getTypeIcon(pokemon)}
               className="type-icon"
               title={getType(pokemon)}/>

          {picturePokedex && <img className="pokemon-img"
                                  src={picturePokedex}
                                  alt="Pokemon Bild"/>}

          <div className="play-btn_container"
               onClick={handleAudioPlay}>
            {isAudioPlaying ? <i className="fas fa-stop"></i>
              : <i className="fas fa-play"></i>}
          </div>
          <div className="pokedex-stats-container">
            <div className="pokedex-stats-title">
              <div className="pokedex-stat-title">ID</div>
              <div className="pokedex-stat-title">Name</div>
              <br/>
              <div className="pokedex-stat-title">Größe</div>
              <div className="pokedex-stat-title">Gewicht</div>
              <div className="pokedex-stat-title">HP</div>
              <div className="pokedex-stat-title">Attack</div>
              <div className="pokedex-stat-title">Defense</div>
              <div className="pokedex-stat-title">Speed</div>
            </div>
            <div className="pokedex-stats-values">
              <div id="Pokedex-id" className="pokedex-stat-value">#{pokemon.id.toString().padStart(3, '0')}</div>
              <div className="pokedex-stat-value pokedex-name">{pokemon.species.name}</div>
              <br/>
              <div className="pokedex-stat-value">{pokemon.height * 10}cm</div>
              <div className="pokedex-stat-value">{pokemon.weight / 10}kg</div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-hp"
                     className="stat-progress stat-progress-hp"
                     style={{width: `${pokemon.stats[0].base_stat / maxStat * 100}%`}}>{pokemon.stats[0].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-attack"
                     className="stat-progress stat-progress-attack"
                     style={{width: `${pokemon.stats[1].base_stat / maxStat * 100}%`}}>{pokemon.stats[1].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-defense"
                     className="stat-progress stat-progress-defense"
                     style={{width: `${pokemon.stats[2].base_stat / maxStat * 100}%`}}>{pokemon.stats[2].base_stat}</div>
              </div>
              <div className="pokedex-stat-value stat-progress-container">
                <div id="Stat-progress-speed"
                     className="stat-progress stat-progress-speed"
                     style={{width: `${pokemon.stats[5].base_stat / maxStat * 100}%`}}>{pokemon.stats[5].base_stat}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="Arrow-right-container"
           className="arrow-right-container buttons-continue"
           onClick={onNextPokemon}>
        <i className="fas fa-arrow-right" title="Next"></i>
      </div>
    </section>
  );
};

export default Pokedex;
