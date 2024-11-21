import './Search.scss';
import { useState, ChangeEvent, useRef, KeyboardEvent } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.tsx';


interface SearchProps {
  allPokemonNames: string[];
  onSearchStart: (name: string) => void;
}

const Search = ({allPokemonNames, onSearchStart}: SearchProps) => {
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchPokemon()
      setShowAutocomplete(false)
    }
  }

  const searchPokemon = () => {
    onSearchStart(searchString)
  };

  const handleNameClick = (name: string) => {
    setSearchString(name);
    onSearchStart(name);
    setShowAutocomplete(false);
  };


  return (
    <div className="search-container"
         ref={containerRef}>
      <input id="Search-input"
             type="text"
             placeholder="Suche Pokemon..."
             value={searchString}
             onChange={handleSearchChange}
             onKeyDown={handleKeyDown}/>

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
