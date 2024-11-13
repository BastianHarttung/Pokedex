import './Header.scss';
import { IoMdSearch } from 'react-icons/io';
import Pokeball from '../../assets/images/favicon_pokeball.png';
import PokemonLogo from '../../assets/images/pokemon-logo.png';


const Header = () => {
  return (
    <header className="header">
      <div className="header-images">
        <img src={Pokeball}
             alt="pokeball"
             className="height-40"/>
        <img src={PokemonLogo}
             alt="pokemon-logo"/>
        <IoMdSearch size={40}/>
      </div>
    </header>);
};

export default Header;
