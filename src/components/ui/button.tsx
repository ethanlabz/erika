import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // FIX: Added 'not-prose' and 'no-underline' to block Fumadocs markdown style hijacking
  "not-prose no-underline inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        // Core Design Tokens
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90 hover:shadow-sm",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20 hover:shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20 active:bg-accent/40",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0 hover:scale-100 p-0 h-auto",
        
        // Academic Status Themes
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
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: LinkProps["href"];
  target?: string;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, href, target, rel, ...props }, ref) => {
    const combinedClasses = cn(buttonVariants({ variant, size, className }));

    if (href) {
      const isExternal = typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"));
      
      return (
        <Link
          href={href}
          className={combinedClasses}
          target={isExternal ? "_blank" : target}
          rel={isExternal ? "noopener noreferrer" : rel}
          ref={ref as any}
          {...(props as any)}
        >
          {props.children}
        </Link>
      );
    }

    return (
      <button
        className={combinedClasses}
        ref={ref}
        type={props.type || "button"}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };