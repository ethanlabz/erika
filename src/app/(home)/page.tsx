import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    /* 🟢 FIX: Swapped relative for fixed inset-0 and locked dimensions with w-screen h-dvh. 
       This cuts off all document layout bleed and eliminates the scrollbar completely. */
    <div className="fixed inset-0 h-dvh w-screen bg-background text-foreground flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 select-none z-0">
      
      {/* 1. ARCHITECTURAL BACKGROUND: Modern Minimalist Tech Grid Mesh */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* 2. DYNAMIC VISUAL ACCENT: Ultra-soft hidden ambient variable glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 md:w-125 md:h-125 rounded-full bg-(--active-accent) opacity-[0.03] blur-[80px] pointer-events-none z-0 transition-all duration-700" />

      {/* 3. HERO CONTENT CONTAINER */}
      {/* Added a subtle mt-12 step-down for mobile screens to give your header bar breathing room */}
      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center gap-6 md:gap-8 mt-12 sm:mt-0">
        
        {/* Dynamic Context Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs font-medium text-muted-foreground tracking-wide backdrop-blur-xs animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-(--active-accent) animate-pulse" />
          Department of Computer Engineering & IoT
        </div>

        {/* Brand Master Logotype Typography */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-foreground bg-linear-to-b from-foreground to-foreground/70">
            Erik<span className="text-(--active-accent)">Labs</span>
          </h1>
          <p className="text-sm md:text-base font-medium text-muted-foreground/90 max-w-xl mx-auto tracking-normal leading-relaxed">
            A minimalist knowledge architecture indexing core notes, practical lab files, and tracking metrics for the <span className="text-foreground font-semibold">3rd Year</span> curriculum.
          </p>
        </div>

        {/* Master Call To Action Controls Grid */}
        <div className="flex items-center gap-3.5 flex-wrap justify-center w-full animate-fade-in-up flex-direction-column uppercase">
          <Button href="/docs/v" size="lg" variant="default">
            Semester V
          </Button>
          <Button href="/docs/vi" size="lg" variant="outline" disabled>
            Semester VI
          </Button>
        </div>

      </div>
    </div>
  );
}