import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import "./inputs.css";

/**
 * @typedef {Object} utlis
 * @property {string} title
 * @property {"input"|"textarea"} elementType
 * @property {React.HTMLAttributes<HTMLLabelElement>} labelProps
 * @property {string} errorText
 * @property {React.ReactNode} icon
 * @property {React.HTMLAttributes<HTMLParagraphElement>} helperTextProps
 * @property {React.HTMLAttributes<HTMLDivElement>} containerProps
 */

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & utlis} props
 */
const Input = (props, ref) => {
  const {
    title,
    labelProps,
    errorText,
    helperTextProps,
    containerProps,
    elementType = "input",
    icon,
    ...rest
  } = props;

  const divContainerClassName = useMemo(() => {
    return `${containerProps?.className || ""} inp`.trim();
  }, [containerProps]);

  const localRef = useRef(null);

  const setRefs = useCallback(
    (el) => {
      localRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref]
  );

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = rest.type === "password";

  const computedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : rest.type || "text";

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((s) => !s);
    if (localRef.current) localRef.current.focus();
  }, []);

  return (
    <div {...containerProps} className={divContainerClassName}>
      {title && (
        <label htmlFor={rest.id || rest.name} {...labelProps}>
          {title}
        </label>
      )}

      {elementType === "textarea" ? (
        <textarea id={rest.id || rest.name} {...rest} ref={setRefs} />
      ) : (
        <div className="relative input-wrapper">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            id={rest.id || rest.name}
            {...rest}
            type={computedType}
            ref={setRefs}
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

export default memo(forwardRef(Input));
