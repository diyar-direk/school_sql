import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../buttons/Button";
import { useTranslation } from "react-i18next";

const CloumnsVisible = ({ columns, setColumns, defaultColumns }) => {
  const [search, setSearch] = useState("");
  const { userDetails } = useAuth();

  const updateRows = useCallback(
    (column) => {
      const updated = columns?.map((col) =>
        col.name === column.name ? { ...col, hidden: !col.hidden } : col
      );
      setColumns(updated);
    },
    [columns, setColumns]
  );

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const bodyClick = () => isOpen && setIsOpen(false);
    window.addEventListener("click", bodyClick);
    return () => window.addEventListener("click", bodyClick);
  }, [isOpen]);

  const resetDefaultColumns = useCallback(() => {
    setIsOpen(false);
    setColumns(defaultColumns);
  }, [setColumns, defaultColumns]);
  const { t } = useTranslation();

  return (
    <article>
      <i className="fa-solid fa-ellipsis" onClick={toggleOpen} />

      {isOpen && (
        <article
          onClick={(e) => e.stopPropagation()}
          className="columns-visible"
        >
          <input
            type="text"
            className="search"
            placeholder="search for cloumn..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          {columns?.map((column) => {
            const headerName = t(column.headerName);

            return (
              (!column.allowedTo ||
                column.allowedTo?.includes(userDetails?.role)) &&
              (!search ? (
                <div key={column.name}>
                  <input
                    type="checkbox"
                    id={column.name}
                    checked={!column.hidden}
                    onChange={() => updateRows(column)}
                  />
                  <label htmlFor={column.name}>{headerName}</label>
                </div>
              ) : (
                (column.name.includes(search) ||
                  headerName.includes(search)) && (
                  <div key={column.name}>
                    <input
                      type="checkbox"
                      id={column.name}
                      checked={!column.hidden}
                      onChange={() => updateRows(column)}
                    />
                    <label htmlFor={column.name}>{headerName}</label>
                  </div>
                )
              ))
            );
          })}

          <Button btnStyleType="outlined" onClick={resetDefaultColumns}>
            <i className="fa-solid fa-rotate-right" /> {t("reset_columns")}
          </Button>
        </article>
      )}
    </article>
  );
};

export default CloumnsVisible;
