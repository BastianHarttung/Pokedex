import "./Toolbar.scss"
import Search from "../Search/Search.tsx";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { ChangeEvent } from "react";
import { Sorting } from "../../models/enums.ts";
import { Sort } from "../../models/interfaces.ts";


const sortingOptions = [
  {value: Sorting.ID, label: 'ID #'},
  {value: Sorting.NAME, label: 'Name'},
  {value: Sorting.BASE_EXPERIENCE, label: 'Erfahrung'},
  {value: Sorting.HP, label: 'HP (Health Points)'},
  {value: Sorting.TYPE, label: 'Typ'},
  {value: Sorting.ORDER, label: 'Reihenfolge'},
  {value: Sorting.HEIGHT, label: 'Größe'},
  {value: Sorting.WEIGHT, label: 'Gewicht'},
];

interface ToolbarProps {
  allPokemonNames: string[] | null;
  onHandleSearch: (searchString: string) => void;
  onHandleSortChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  sorting: Sort;
  onHandleDirectionChange: () => void;
  fetchedPokemonLength: number;
  filteredPokemonLength: number;
}

const Toolbar = (
  {
    allPokemonNames,
    onHandleSearch,
    onHandleSortChange,
    sorting,
    onHandleDirectionChange,
    fetchedPokemonLength,
    filteredPokemonLength
  }: ToolbarProps) => {

  return (
    <div className="search-sorting_container">
      <Search allPokemonNames={allPokemonNames ? allPokemonNames : []}
              onSearchStart={onHandleSearch}/>

      <div className="sorting_container">
        <label htmlFor="sort">Sortieren nach</label>

        <div className="sorting-input_container">
          <select name="sort" id="sort"
                  onChange={onHandleSortChange}>
            {sortingOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {sorting.direction === "asc" ? (
              <GoSortAsc size={24}
                         className="direction-icon"
                         title="Aktuell aufsteigend sortiert"
                         onClick={onHandleDirectionChange}/>)
            : <GoSortDesc size={24}
                          className="direction-icon"
                          title="Aktuell absteigend sortiert"
                          onClick={onHandleDirectionChange}/>}
        </div>
      </div>

      <div className="number-loaded">
        {(fetchedPokemonLength > 0 && fetchedPokemonLength < (allPokemonNames?.length || 1302)) && (
          <div>
            <b>{fetchedPokemonLength}</b> von {allPokemonNames?.length} geladen.
          </div>
        )}

        {fetchedPokemonLength >= (allPokemonNames?.length || 1302) && (
          <div>
            Alle {allPokemonNames?.length || 1302} Pokemon geladen
          </div>
        )}

        {fetchedPokemonLength !== filteredPokemonLength && (
          <div>
            <b>{filteredPokemonLength}</b> Pokemon gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
