import { memo, useMemo } from "react";
import "./inputs.css";
/**
 * @typedef {Object} utlis
 * @property {string} title
 * @property  {"input"|"textarea"} elementType - input style most be input or textarea
 * @property {React.HTMLAttributes<HTMLLabelElement>} labelProps
 * @property {string} errorText
 * @property {React.HTMLAttributes<HTMLParagraphElement>} helperTextProps
 * @property {React.HTMLAttributes<HTMLDivElement>} containerProps
 */

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & utlis} props
 */
const Input = ({
  title,
  labelProps,
  errorText,
  helperTextProps,
  containerProps,
  elementType,
  ...props
}) => {
  const divContainerClassName = useMemo(() => {
    return `${containerProps?.className || ""} inp`.trim();
  }, [containerProps]);

  return (
    <div {...containerProps} className={divContainerClassName}>
      {title && (
        <label htmlFor={props.id || props.name} {...labelProps}>
          {title}
        </label>
      )}
      {elementType === "textarea" ? (
        <textarea id={props.id || props.name} type="text" {...props}></textarea>
      ) : (
        <div className="relative">
          <input id={props.id || props.name} type="text" {...props} />
        </div>
      )}

      {errorText && (
        <p className="field-error" {...helperTextProps}>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default memo(Input);
