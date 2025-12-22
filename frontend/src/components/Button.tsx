import styles from "./Button.module.css";
import cn from "classnames";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  appearance?: "big" | "small";
}

function Button({
  children,
  className,
  appearance = "small",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(styles["button"], styles["accent"], className, {
        [styles["small"]]: appearance === "small",
        [styles["big"]]: appearance === "big",
      })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
