import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "not-prose no-underline inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.97] [&_svg:not(.animate-spin)]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90 hover:shadow-sm",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20 hover:shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20 active:bg-accent/40",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0 hover:scale-100 p-0 h-auto",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90 hover:shadow-md",
        warning: "bg-amber-500 text-black font-semibold shadow-sm hover:bg-amber-500/90 dark:text-white hover:shadow-md",
        info: "bg-blue-600 text-white shadow-sm hover:bg-blue-600/90 dark:bg-blue-500 dark:hover:bg-blue-500/90 hover:shadow-md",
        accent: "bg-fuchsia-600 text-white shadow-sm hover:bg-fuchsia-600/90 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-500/90 hover:shadow-md",
      },
      size: {
        xs: "h-7 rounded-sm px-2 text-xs font-normal gap-1",
        sm: "h-8 rounded-md px-3 text-xs gap-1.5",
        default: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-6 text-base",
        xl: "h-11 rounded-lg px-8 text-base tracking-wide",
        icon: "size-9 rounded-md p-0",
        "icon-sm": "size-8 rounded-md p-0",
        "icon-lg": "size-10 rounded-md p-0",
      },
      disabled: {
        true: "pointer-events-none opacity-50 shadow-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
  VariantProps<typeof buttonVariants> {
  href?: LinkProps["href"];
  target?: string;
  rel?: string;
  /** Automatically shows a spinner and disables the button */
  loading?: boolean;
  /** Declares "disabled" strictly as a boolean for safety */
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, disabled, loading, href, target, rel, children, ...props }, ref) => {

    // 1. Force the button to be disabled if the loading state is active
    const isCurrentlyDisabled = disabled || loading;

    const combinedClasses = cn(buttonVariants({ variant, size, disabled: isCurrentlyDisabled, className }));

    // 2. The standard Tailwind SVG spinner
    const Spinner = (
      <svg
        className="animate-spin size-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    // 3. Assemble the inner content
    const content = (
      <>
        {loading && Spinner}
        {children}
      </>
    );

    // 4. Render Link or Button based on props
    if (href) {
      const isExternal = typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"));

      return (
        <Link
          href={isCurrentlyDisabled ? "#" : href}
          className={combinedClasses}
          target={isExternal ? "_blank" : target}
          rel={isExternal ? "noopener noreferrer" : rel}
          ref={ref as any}
          aria-disabled={isCurrentlyDisabled}
          tabIndex={isCurrentlyDisabled ? -1 : undefined}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        className={combinedClasses}
        ref={ref}
        disabled={isCurrentlyDisabled}
        type={props.type || "button"}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };