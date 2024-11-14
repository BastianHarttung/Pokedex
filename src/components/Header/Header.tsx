import './Header.scss';
import Pokeball from '../../assets/images/favicon_pokeball.png';
import PokemonLogo from '../../assets/images/pokemon-logo.png';
import PikachuImage from '../../assets/images/PokemonTest.png';


const Header = () => {
  return (
    <header className="header">
      <div className="header-images">
        <img src={Pokeball}
             alt="pokeball"
             className="pokeball"/>

        <img src={PokemonLogo}
             alt="pokemon-logo"/>

        <img src={PikachuImage}
             alt="pikachu"
             className="pikachu"/>
      </div>
    </header>);
};

export default Header;
