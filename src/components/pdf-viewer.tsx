"use client";

import React, { useEffect, useState } from "react";

type ViewMode = "original" | "inverted";

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

// Inverting an entire PDF is a blunt instrument: it reads fine on plain
// black-on-white text and wrecks photos, scans, and colored diagrams.
// It's exposed as an explicit opt-in below, never auto-applied from the
// site's theme, and never the default.
const VIEW_FILTERS: Record<ViewMode, string> = {
  original: "none",
  inverted: "invert(0.92) hue-rotate(180deg) brightness(1.05) contrast(0.95)",
};

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6v6M20 4L10 14" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function PDFViewer({
  title,
  url,
  uploader = "System",
  theme = "primary",
}: PDFViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const currentStyles = styleMaps[theme] || styleMaps.primary;

  useEffect(() => {
    const saved = localStorage.getItem(`pdf-view-${url}`);
    if (saved === "original" || saved === "inverted") {
      setViewMode(saved);
    }
  }, [url]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(`pdf-view-${url}`, mode);
  };

  // Same-origin asset, served directly by this site — no relay needed.
  // Native PDF rendering (Chrome, Firefox, Edge, desktop Safari) handles
  // this without a third party. "Open" / "Download" stay visible at all
  // times so there's always a way to read the document even if a given
  // browser can't render the inline preview.
  const viewerUrl = `${url}#toolbar=1&navpanes=0&statusbar=0&view=FitH`;

  return (
    <div className={`not-prose my-6 w-full rounded-xl border bg-card p-4 shadow-xs transition-all duration-300 ${currentStyles.border}`}>
      <div className="flex flex-col gap-3 border-b border-inherit pb-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <DocumentIcon className={`h-5 w-5 shrink-0 ${currentStyles.text}`} />
          <h3 className="font-semibold tracking-tight text-sm md:text-base text-foreground truncate">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t border-dashed border-border sm:border-0">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium whitespace-nowrap">View:</span>
            <select
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value as ViewMode)}
              className="bg-background text-foreground text-xs font-medium border border-border rounded-md px-2 py-1 outline-hidden cursor-pointer transition-colors duration-150 hover:bg-accent"
            >
              <option value="original">Original</option>
              <option value="inverted">Inverted (beta)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
            <a
              href={url}
              download
              title="Download"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <DownloadIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-muted-foreground">By:</span>
            <span className={`px-2.5 py-0.5 rounded-full border font-medium tracking-wide transition-all ${currentStyles.badge}`}>
              {uploader}
            </span>
          </div>
        </div>
      </div>

      {viewMode === "inverted" && (
        <p className="text-xs text-muted-foreground mb-2">
          Inverted view can distort photos, diagrams, or scanned pages in this document.
        </p>
      )}

      <div className="relative w-full overflow-hidden rounded-lg border border-inherit bg-background shadow-inner h-137.5 sm:h-162.5 lg:h-auto lg:aspect-4/3">
        {!iframeLoaded && (
          <div className="absolute inset-0 h-full w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse">
            Loading document...
          </div>
        )}
        <iframe
          src={viewerUrl}
          title={title}
          onLoad={() => setIframeLoaded(true)}
          className="h-full w-full border-0 rounded-lg transition-all duration-300 ease-in-out"
          style={{ filter: VIEW_FILTERS[viewMode], opacity: iframeLoaded ? 1 : 0 }}
          loading="lazy"
        />
      </div>
    </div>
  );
}