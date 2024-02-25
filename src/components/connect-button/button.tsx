import type { ButtonProps } from "@/components/ui/button";
import { Button as BaseButton } from "@/components/ui/button";
import * as React from "react";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <BaseButton
        {...props}
        ref={ref}
        className="h-[2.25rem] gap-[0.225rem] rounded-[0.3125rem] border border-primary bg-transparent px-[0.94rem] 
    font-light
    text-white
    transition-opacity 
    hover:bg-transparent
    hover:opacity-80
    focus-visible:ring-0 active:bg-transparent active:opacity-60 md:gap-[0.625rem]"
      />
    );
  },
);

Button.displayName = "Button";

export default Button;