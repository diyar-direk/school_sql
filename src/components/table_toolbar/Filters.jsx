import { useCallback, useState } from "react";
import IconButton from "../buttons/IconButton";
import PopUp from "../popup/PopUp";
import "./filters.css";
const Filters = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  return (
    <>
      <IconButton title="filters" color="secondry-color" onClick={toggleOpen}>
        <i className="fa-solid fa-sliders" />
      </IconButton>
      <PopUp isOpen={isOpen} onClose={toggleOpen} className="grid-3">
        {children}
      </PopUp>
    </>
  );
};

export default Filters;
