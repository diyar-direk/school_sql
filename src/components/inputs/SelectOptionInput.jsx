import { memo, useCallback, useEffect, useRef, useState } from "react";
import "./inputs.css";
import Button from "../buttons/Button";
/**
 * @typedef utils
 * @property {array} options
 * @property {string} errorText
 * @property {string} label
 * @property {string} placeholder
 * @property {string} value
 * @property {()=> void} onIgnore
 * @property {()=> void} onSelectOption
 * @property {HTMLElement} addOption
 */
/**
 *
 * @param {utils} props
 */
const SelectOptionInput = ({
  label,
  placeholder,
  onIgnore,
  value,
  options,
  onSelectOption,
  errorText,
  addOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const toggelOptionArea = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (option) => {
      option.onSelectOption ? option.onSelectOption() : onSelectOption(option);
      setIsOpen(false);
      setHighlightIndex(-1);
    },
    [onSelectOption]
  );

  useEffect(() => {
    const onBodyClick = (e) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };

    window.addEventListener("click", onBodyClick);
    return () => window.removeEventListener("click", onBodyClick);
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % options.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev - 1 + options.length) % options.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < options.length) {
        handleSelect(options[highlightIndex]);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="select-input" ref={containerRef} onKeyDown={handleKeyDown}>
      <label
        tabIndex={0}
        onFocus={() => setIsOpen(true)}
        onClick={toggelOptionArea}
        className="title"
      >
        {label}
      </label>
      <div onClick={toggelOptionArea} className="placeholder center relative">
        <span className="flex-1 ellipsis"> {placeholder}</span>
        <i className="fa-solid fa-chevron-down"></i>
        <article className={`${isOpen ? "active " : ""}options`}>
          {addOption}
          {options?.map((opt, index) => (
            <h3
              key={opt.text}
              onClick={() => handleSelect(opt)}
              className={highlightIndex === index ? "highlight" : ""}
            >
              {opt?.text}
            </h3>
          ))}
        </article>
      </div>
      {value && (
        <Button onClick={onIgnore} btnStyleType="outlined" btnType="delete">
          {value}
        </Button>
      )}
      {errorText && <p className="field-error">{errorText}</p>}
    </div>
  );
};

export default memo(SelectOptionInput);
