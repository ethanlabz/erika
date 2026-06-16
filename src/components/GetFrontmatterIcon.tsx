import React from 'react';
import * as LucideIcons from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcon'; // Your SimpleIcons component

export function getFrontmatterIcon(iconName: string | undefined) {
  if (!iconName) return undefined;

  // 1. Try parsing custom Simple Icons first (e.g., "java" -> siJava)
  const simpleIconKey = `si${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}` as any;
  
  // 2. Fallback to parsing standard Lucide Icons (e.g., "terminal" -> Terminal)
  const lucideIconKey = (iconName.charAt(0).toUpperCase() + iconName.slice(1)) as keyof typeof LucideIcons;

  // Render Simple Icon if it exists in your registry
  if (iconName.toLowerCase() === 'java' || iconName.toLowerCase() === 'discord') {
    return <BrandIcon iconName={simpleIconKey} className="h-4 w-4" />;
  }

  // Render Lucide Icon if found
  const LucideIconComponent = LucideIcons[lucideIconKey] as React.ComponentType<{ className?: string }>;
  if (LucideIconComponent) {
    return <LucideIconComponent className="h-4 w-4" />;
  }

  return undefined;
}