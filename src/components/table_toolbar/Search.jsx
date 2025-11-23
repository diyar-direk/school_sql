import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

const Search = ({ delay = 500, setSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const { t } = useTranslation();
  const [debouncedValue] = useDebounce(inputValue, delay);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <label className="table-toolbar-search">
      <input
        type="text"
        placeholder={t("attendance.search_btn")}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <i className="fa-solid fa-magnifying-glass" />
    </label>
  );
};

export default Search;
