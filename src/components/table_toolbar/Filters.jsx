import { Fragment, useCallback, useState } from "react";
import IconButton from "../buttons/IconButton";
import PopUp from "../popup/PopUp";
import "./filters.css";
import Input from "../inputs/Input";
import AllowedTo from "../AllowedTo";
import { roles } from "../../constants/enums";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

/**
 * @typedef {Object} dateFieldsProps
 * @property {string} name
 * @property {string} title
 * @property {"datetime-local" | "date" | "time"} [type]
 * @property {Array} [roles]
 */

/**
 * @typedef {Object} FilerProps
 * @property {object} filters
 * @property {React.SetStateAction} setFilters
 * @property {boolean} [hideCreatedAtInputs]
 * @property {dateFieldsProps[]} dateFields
 */

/**
 * @param {FilerProps} props
 */

const Filters = ({
  children,
  filters,
  setFilters,
  hideCreatedAtInputs = false,
  dateFields,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleChange = useCallback(
    (e) => {
      const { value, name } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [setFilters]
  );

  const { userDetails } = useAuth();
  const { role } = userDetails || {};

  const { t } = useTranslation();

  return (
    <>
      <IconButton title="filters" color="secondry-color" onClick={toggleOpen}>
        <i className="fa-solid fa-sliders" />
      </IconButton>
      <PopUp isOpen={isOpen} onClose={toggleOpen} className="grid-3">
        {!hideCreatedAtInputs && (
          <AllowedTo roles={[roles.admin]}>
            <Input
              title={`${t("createdAt")} ${t("filters.from")}`}
              type="date"
              value={filters?.["createdAt[gte]"]}
              name="createdAt[gte]"
              onInput={handleChange}
            />
            <Input
              title={`${t("createdAt")} ${t("filters.to")}`}
              type="date"
              value={filters?.["createdAt[lte]"]}
              name="createdAt[lte]"
              onInput={handleChange}
            />
          </AllowedTo>
        )}

        {dateFields?.map(
          (e, i) =>
            (!e?.roles || e?.roles?.includes(role)) && (
              <Fragment key={i}>
                <Input
                  {...e}
                  title={`${t(e.title)} ${t("filters.from")}`}
                  type={e.type || "date"}
                  value={filters?.[`${e.name}[gte]`]}
                  name={`${e.name}[gte]`}
                  onInput={handleChange}
                />
                <Input
                  {...e}
                  title={`${t(e.title)} ${t("filters.to")}`}
                  type={e.type || "date"}
                  value={filters?.[`${e.name}[lte]`]}
                  name={`${e.name}[lte]`}
                  onInput={handleChange}
                />
              </Fragment>
            )
        )}

        {children}
      </PopUp>
    </>
  );
};

export default Filters;
