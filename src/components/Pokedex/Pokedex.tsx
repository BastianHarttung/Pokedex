import './Pokedex.scss';
import { useEffect, useRef, useState } from 'react';
import { Pokemon } from 'pokenode-ts';
import PokedexBG from '../../assets/images/pokedex-bg.png';
import { PokemonWithSound } from '../../models/interfaces.ts';
import { getTypeIcon, getType } from '../../constants/typeIcons.ts';


interface PokedexProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  onNextPokemon: () => void;
  onPrevPokemon: () => void;
}

const Pokedex = ({pokemon, onClose, onNextPokemon, onPrevPokemon}: PokedexProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0)

  const picturePokedex = pokemon?.sprites.other?.dream_world.front_default || pokemon?.sprites.other?.
    ['official-artwork'].front_default;

  const maxStat = Math.max(pokemon?.stats[0].base_stat || 0,
    pokemon?.stats[1].base_stat || 0,
    pokemon?.stats[2].base_stat || 0,
    pokemon?.stats[5].base_stat || 0,
    100);

  const pokemonWithSound = pokemon as PokemonWithSound;

  const pokemonSounds = [pokemonWithSound?.cries?.latest, pokemonWithSound?.cries?.legacy].filter(sound => sound !== null);

  const handleAudio = () => {
    const playAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(pokemonSounds[currentSoundIndex]);
        audioRef.current.volume = 0.2;

        audioRef.current.addEventListener('playing', () => setIsAudioPlaying(true));
        audioRef.current.addEventListener('ended', () => {
          setIsAudioPlaying(false)
          setCurrentSoundIndex((prev) => (prev + 1) % pokemonSounds.length);
          audioRef.current = null;
        });
        audioRef.current.addEventListener('error', () => {
          setIsAudioPlaying(false)
          console.error("Audio playback error")
          audioRef.current = null
        });
      }
      audioRef.current.play()
        .catch((err) => {
          setIsAudioPlaying(false);
          console.error('Error playing sound', err);
        });
    }

    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
      }
    };

    if (!isAudioPlaying && pokemonSounds.length > 0) playAudio()
    else stopAudio();
  }


  useEffect(() => {
    if (pokemon) document.body.style.overflow = "hidden";
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

          {pokemonSounds.length > 0 && <div className="play-btn_container"
                                            onClick={handleAudio}>
            {isAudioPlaying ? <i className="fas fa-stop"></i>
              : <i className="fas fa-play"></i>}
          </div>}

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
