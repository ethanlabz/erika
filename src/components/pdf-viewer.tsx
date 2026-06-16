"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

type PDFTheme = "light" | "dark";

interface PDFViewerProps {
  title: string;
  url: string;
  uploader?: string;
  theme?: "primary" | "secondary" | "accent" | "muted";
}

const styleMaps = {
  primary: {
    border: "border-primary/20 dark:border-primary/30",
    text: "text-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  secondary: {
    border: "border-border",
    text: "text-foreground",
    badge: "bg-secondary text-secondary-foreground border-border",
  },
  accent: {
    border: "border-fuchsia-500/20 dark:border-fuchsia-400/30",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    badge: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
  },
  muted: {
    border: "border-muted",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground border-transparent",
  },
};

const pdfFilterMaps: Record<PDFTheme, string> = {
  light: "sepia(0.4) saturate(1.1) brightness(1.02) contrast(0.98)",
  dark: "invert(0.92) hue-rotate(180deg) brightness(1.05) contrast(0.95)",
};

export function PDFViewer({ 
  title, 
  url, 
  uploader = "System", 
  theme = "primary"
}: PDFViewerProps) {
  const { resolvedTheme } = useTheme();
  const [pdfTheme, setPdfTheme] = useState<PDFTheme>("light");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const currentStyles = styleMaps[theme] || styleMaps.primary;

  useEffect(() => {
    // 1. Sync User View Preferences
    const savedPreference = localStorage.getItem(`pdf-pref-${url}`);
    if (savedPreference === "light" || savedPreference === "dark") {
      setPdfTheme(savedPreference);
    } else {
      setPdfTheme(resolvedTheme === "dark" ? "dark" : "light");
    }

    // 2. Resolve Environment & Setup Production Routing
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      
      if (isLocal) {
        // Local Dev Server: Standard high-performance local direct file view
        setIframeUrl(`${url}#toolbar=1&navpanes=0&statusbar=0&messages=0`);
      } else {
        // Live Netlify Production: Route through an authorized cloud viewer to bypass CDN iframe blocks
        const absoluteAssetUrl = `${window.location.origin}${url}`;
        setIframeUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteAssetUrl)}&embedded=true`);
      }
    }
  }, [url, resolvedTheme]);

  const handleThemeUpdate = (selectedTheme: PDFTheme) => {
    setPdfTheme(selectedTheme);
    localStorage.setItem(`pdf-pref-${url}`, selectedTheme);
  };

  return (
    <div className={`not-prose my-6 w-full rounded-xl border bg-card p-4 shadow-xs transition-all duration-300 ${currentStyles.border}`}>
      
      {/* Header Panel Controls */}
      <div className="flex flex-col gap-3 border-b border-inherit pb-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <svg 
            className={`h-5 w-5 shrink-0 ${currentStyles.text}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold tracking-tight text-sm md:text-base text-foreground truncate">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t border-dashed border-border sm:border-0">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium whitespace-nowrap">Doc View:</span>
            <select
              value={pdfTheme}
              onChange={(e) => handleThemeUpdate(e.target.value as PDFTheme)}
              className="bg-background text-foreground text-xs font-medium border border-border rounded-md px-2 py-1 outline-hidden cursor-pointer transition-colors duration-150 hover:bg-accent"
            >
              <option value="light">Light (Sepia)</option>
              <option value="dark">Charcoal Dark</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-muted-foreground">By:</span>
            <span className={`px-2.5 py-0.5 rounded-full border font-medium tracking-wide transition-all ${currentStyles.badge}`}>
              {uploader}
            </span>
          </div>
        </div>
      </div>

      {/* Frame Viewport Container */}
      <div className="relative w-full overflow-hidden rounded-lg border border-inherit bg-background shadow-inner h-137.5 sm:h-162.5 lg:h-auto lg:aspect-4/3">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title={title}
            className="h-full w-full border-0 rounded-lg transition-all duration-300 ease-in-out"
            style={{ filter: pdfFilterMaps[pdfTheme] }}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
            Loading document pipeline...
          </div>
        )}
      </div>
    </div>
  );
}