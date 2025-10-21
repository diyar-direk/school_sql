import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

const Search = ({ delay = 500, setSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const [debouncedValue] = useDebounce(inputValue, delay);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <label className="table-toolbar-search">
      <input
        type="text"
        placeholder="search for ..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <i className="fa-solid fa-magnifying-glass" />
    </label>
  );
};

export default Search;
