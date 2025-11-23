import { useCallback, useEffect, useState } from "react";
import Button from "../buttons/Button";
import { useDebounce } from "use-debounce";
import { useInfiniteFetch } from "../../hooks/useInfiniteFetch";
import "./inputs.css";
import { useTranslation } from "react-i18next";

/**
 * @typedef {Object} SelectInputApiProps
 * @property {string} label - عنوان الحقل (اختياري).
 * @property {string} placeholder - النص الافتراضي الظاهر في حقل البحث أو العرض.
 * @property {(option: any) => string} optionLabel - دالة لتحويل كائن الخيار إلى نص قابل للعرض.
 * @property {(option: any) => void} onChange - دالة تُستدعى عند اختيار خيار من القائمة، تستقبل الكائن المختار.
 * @property {(option?: any) => void} onIgnore - دالة تُستدعى لحذف خيار (في حالة الاختيار المفرد أو المتعدد).
 * @property {any | any[]} value - القيمة الحالية المختارة، يمكن أن تكون كائن أو مصفوفة من الكائنات.
 * @property {boolean} isArray - تحدد إذا كانت القيمة المختارة مصفوفة (اختيار متعدد) أو مفردة.
 * @property {string} endPoint - رابط الـ API لجلب البيانات.
 * @property {object} params - خصائص اضافية للفلترة
 * @property {string} [errorText] - نص الخطأ ليتم عرضه (اختياري).
 * @property {number} [delay=500] - تأخير الـ debounce بالميللي ثانية (اختياري).
 * @property {HTMLElement} [addOption] - اضافة اختيار (اختياري).
 * @param {SelectInputApiProps & React.HTMLAttributes<HTMLDivElement>} props - خصائص الكومبوننت بالإضافة إلى خصائص HTML قياسية للـ div.
 */
const SelectInputApi = ({
  placeholder,
  label,
  optionLabel,
  onChange,
  onIgnore,
  value,
  endPoint,
  isArray,
  errorText,
  delay = 500,
  addOption,
  params = {},
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, delay);
  const { t } = useTranslation();
  const { data, loadMoreRef, isFetching } = useInfiniteFetch({
    endPoint: endPoint,
    limit: 3,
    search: debouncedSearch,
    ...params,
  });

  const items = data?.pages?.flatMap((data) => data.data);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const toggleOpen = useCallback(
    (e) => {
      stopPropagation(e);
      setIsOpen((prev) => !prev);
    },
    [stopPropagation]
  );

  useEffect(() => {
    const onBodyClick = () => {
      if (isOpen) setIsOpen(false);
      setSelectedIndex(-1);
    };

    window.addEventListener("click", onBodyClick);

    return () => {
      window.removeEventListener("click", onBodyClick);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      onChange(items[selectedIndex]);
      setIsOpen(false);
      setSearch("");
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="select-input inp">
      {label && (
        <label className="title font-color" onClick={toggleOpen}>
          {label}
        </label>
      )}

      <div className="placeholder center relative" onClick={toggleOpen}>
        <span className="flex-1 ellipsis"> {placeholder}</span>
        <i className="fa-solid fa-chevron-down" />

        <div {...props} className={`${isOpen ? "active " : ""} options`}>
          <label
            htmlFor="search"
            onClick={stopPropagation}
            className="auto-complete-search"
          >
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
                setSelectedIndex(-1);
              }}
              placeholder={t("filters.search")}
              onKeyDown={handleKeyDown}
              id="search"
            />
            <i className="fa-solid fa-magnifying-glass" />
          </label>
          <article>
            {addOption}
            {items?.map((itm, i) => (
              <h3
                key={itm.id}
                onClick={() => {
                  onChange(itm);
                }}
                ref={i === items?.length - 1 ? loadMoreRef : null}
                className={i === selectedIndex ? "highlight" : ""}
              >
                {optionLabel(itm)}
              </h3>
            ))}
            {isFetching && (
              <p className="font-color">{t("teachers.loading")}</p>
            )}
          </article>
        </div>
      </div>

      {isArray && value?.length > 0 ? (
        <div className="array-of-values">
          {value?.map((span, i) => (
            <Button
              onClick={() => onIgnore(span)}
              key={span.id || i}
              btnStyleType="outlined"
              btnType="delete"
              className="selected-value"
            >
              {typeof span === "string" ? span : optionLabel(span)}
            </Button>
          ))}
        </div>
      ) : (
        !isArray &&
        value && (
          <Button onClick={onIgnore} btnStyleType="outlined" btnType="delete">
            {typeof value === "string" ? value : optionLabel(value)}
          </Button>
        )
      )}
      {errorText && <p className="field-error">{errorText}</p>}
    </div>
  );
};

export default SelectInputApi;
