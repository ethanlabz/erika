"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface DocViewerProps {
  title: string;
  url: string;
  uploader?: string;
  forceGoogleDocs?: boolean;
}

export function DocViewer({
  title,
  url,
  uploader = "System",
  forceGoogleDocs = false
}: DocViewerProps) {
  const { resolvedTheme } = useTheme();
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [invertDoc, setInvertDoc] = useState<boolean>(false);

  // 🟢 NEW: Track if we are hitting the localhost limitation
  const [isLocalDevError, setIsLocalDevError] = useState<boolean>(false);

  useEffect(() => {
    setInvertDoc(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    setIsLoading(true);
    setIsLocalDevError(false);

    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const fileExtension = url.split('.').pop()?.toLowerCase() || '';
      const isPdf = fileExtension === "pdf";
      const absoluteAssetUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;

      if (isLocal && isPdf && !forceGoogleDocs) {
        // Safe: Browsers can render local PDFs directly
        setIframeUrl(`${url}#toolbar=1&navpanes=0&scrollbar=0`);
      } else if (isLocal && !url.startsWith("http")) {
        // 🟢 NEW: It's a local Word/Excel file. Google can't reach it. 
        // Stop the iframe and show our custom fallback UI.
        setIsLocalDevError(true);
        setIsLoading(false);
      } else {
        // Safe: It's deployed, OR it's an external public URL. Send to Google.
        setIframeUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteAssetUrl)}&embedded=true`);
      }
    }
  }, [url, forceGoogleDocs]);

  const filterStyle = invertDoc
    ? "invert(0.92) hue-rotate(180deg) brightness(1.05) contrast(0.95)"
    : "none";

  const fileExtension = url.split('.').pop()?.toLowerCase() || '';

  return (
    <div className="not-prose my-6 w-full rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Action Bar (Unchanged) */}
      <div className="flex flex-col gap-3 border-b border-border pb-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <DocumentIcon extension={fileExtension} />
          <h3 className="font-semibold tracking-tight text-sm md:text-base text-foreground truncate">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-dashed border-border sm:border-0 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Uploaded by:</span>
            <span className="px-2.5 py-0.5 rounded-full border border-border bg-secondary text-secondary-foreground font-medium tracking-wide">
              {uploader}
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-border pl-3">
            <button onClick={() => setInvertDoc(!invertDoc)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title={invertDoc ? "Switch Document to Light Mode" : "Switch Document to Dark Mode"}>
              {invertDoc ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href={url} download={`${title}.${fileExtension}`} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title="Download Document">
              <DownloadIcon />
            </a>
            <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title="Open in New Tab">
              <ExternalLinkIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-background shadow-inner h-[500px] sm:h-[600px] lg:h-[750px]">

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 animate-pulse">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              Connecting to document pipeline...
            </span>
          </div>
        )}

        {/* 🟢 NEW: Local Development Fallback UI */}
        {isLocalDevError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 p-6 text-center">
            <div className="p-4 rounded-full bg-background border border-border mb-4 shadow-sm">
              <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Dev Mode: Preview Unavailable</h4>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Google Docs Viewer cannot access files hosted on localhost. This document will render automatically once deployed to production.
            </p>
            <a
              href={url}
              download={`${title}.${fileExtension}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <DownloadIcon /> Download to View
            </a>
          </div>
        )}

        {/* The Frame */}
        {iframeUrl && !isLocalDevError && (
          <iframe
            src={iframeUrl}
            title={title}
            onLoad={() => setIsLoading(false)}
            className="h-full w-full border-0 transition-opacity duration-500 ease-in-out bg-white"
            style={{
              filter: filterStyle,
              opacity: isLoading ? 0 : 1
            }}
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

function SunIcon() { return <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; }
function MoonIcon() { return <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>; }
function DownloadIcon() { return <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>; }
function ExternalLinkIcon() { return <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>; }
function DocumentIcon({ extension }: { extension: string }) {
  const baseClasses = "h-5 w-5 shrink-0";
  switch (extension) {
    case 'pdf': return <svg className={`${baseClasses} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case 'xlsx': case 'csv': return <svg className={`${baseClasses} text-emerald-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case 'docx': case 'doc': return <svg className={`${baseClasses} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    default: return <svg className={`${baseClasses} text-foreground`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>;
  }
}