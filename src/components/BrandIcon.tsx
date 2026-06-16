"use client";

import React from "react";
import * as icons from "simple-icons";

interface BrandIconProps extends React.ComponentProps<"svg"> {
  // Provides autocomplete for icon names (e.g., 'siJava', 'siDiscord', 'siPython')
  iconName: keyof typeof icons; 
  size?: number;
}

export function BrandIcon({ iconName, size = 20, className, ...props }: BrandIconProps) {
  const icon = icons[iconName];

  if (!icon || typeof icon !== "object" || !("path" in icon)) {
    console.warn(`Simple Icon "${iconName}" was not found in the icon registry.`);
    return null;
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d={icon.path} />
    </svg>
  );
}