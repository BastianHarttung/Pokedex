import './Search.scss';
import { useState, ChangeEvent, useRef } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.tsx';


interface SearchProps {
  allPokemonNames: string[];
  onClickAutocomplete: (name: string) => void;
}

const Search = ({allPokemonNames, onClickAutocomplete}: SearchProps) => {
  const [searchString, setSearchString] = useState<string>('');
  const [shownPokemonNames, setShownPokemonNames] = useState<string[]>(allPokemonNames);

  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setShowAutocomplete(false));

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchString(value);

    if (value.length >= 1) {
      setShownPokemonNames(allPokemonNames.filter((name) => name.includes(value)));
      setShowAutocomplete(true);
    } else setShowAutocomplete(false);
  };

  const searchPokemon = () => {
  };

  const handleNameClick = (name: string) => {
    onClickAutocomplete(name);
    setSearchString(name);
    setShowAutocomplete(false);
  };


  return (
    <div className="search-container"
         ref={containerRef}>
      <input id="Search-input"
             type="text"
             placeholder="Suche Pokemon..."
             value={searchString}
             onChange={handleSearchChange}/>

      <IoMdSearch size={35}
                  className="search-icon_input"
                  title="Suche starten"
                  onClick={searchPokemon}/>

      {showAutocomplete && <div className="auto-complete_container">
        {shownPokemonNames.map((name, index) => (
          <div key={index}
               className="auto-complete_item"
               onClick={() => handleNameClick(name)}>{name}</div>
        ))}
      </div>
      }
    </div>
  );
};

export default Search;
