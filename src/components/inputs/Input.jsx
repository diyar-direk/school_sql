import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import "./inputs.css";

/**
 * @typedef {Object} utlis
 * @property {string} title
 * @property {"input"|"textarea"} elementType - input style most be input or textarea
 * @property {React.HTMLAttributes<HTMLLabelElement>} labelProps
 * @property {string} errorText
 * @property {React.ReactNode} icon
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
  elementType = "input",
  icon,
  ...props
}) => {
  const divContainerClassName = useMemo(() => {
    return `${containerProps?.className || ""} inp`.trim();
  }, [containerProps]);

  const inputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = props.type === "password";

  const computedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : props.type || "text";

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((s) => !s);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div {...containerProps} className={divContainerClassName}>
      {title && (
        <label htmlFor={props.id || props.name} {...labelProps}>
          {title}
        </label>
      )}

      {elementType === "textarea" ? (
        <textarea id={props.id || props.name} {...props} />
      ) : (
        <div className="relative input-wrapper">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            id={props.id || props.name}
            {...props}
            type={computedType}
            ref={inputRef}
          />
          {isPasswordField && (
            <i
              className={
                showPassword
                  ? "fa-solid fa-eye password"
                  : "fa-solid fa-eye-slash password"
              }
              onClick={togglePasswordVisibility}
            />
          )}
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
