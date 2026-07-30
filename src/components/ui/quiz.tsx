"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, X, AlertCircle } from "lucide-react";

interface QuizProps {
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function Quiz({ question, code, options, correctIndex, explanation }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="my-6 rounded-xl border border-border bg-card p-6 shadow-md text-foreground">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
        <h4 className="font-bold text-base leading-snug">{question}</h4>
      </div>

      {code && (
        <pre className="my-4 overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-xs text-foreground border border-border">
          <code>{code}</code>
        </pre>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {options.map((opt, idx) => {
          let optionStyle = "border-border hover:bg-muted/50";
          if (selectedOption === idx) {
            optionStyle = "border-primary bg-primary/5 text-primary font-medium";
          }
          if (isSubmitted) {
            if (idx === correctIndex) {
              optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold";
            } else if (selectedOption === idx) {
              optionStyle = "border-destructive bg-destructive/10 text-destructive font-semibold";
            } else {
              optionStyle = "opacity-50 border-border";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isSubmitted}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border text-left text-sm transition-all duration-200 ${optionStyle}`}
            >
              <span>{opt}</span>
              {isSubmitted && idx === correctIndex && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
              {isSubmitted && selectedOption === idx && idx !== correctIndex && (
                <X className="h-4 w-4 text-destructive shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3 items-center">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-border text-xs font-semibold rounded-md hover:bg-muted transition"
          >
            Reset Quiz
          </button>
        )}
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden rounded-lg bg-muted/40 border border-border p-4 text-xs leading-relaxed text-muted-foreground"
          >
            <span className="font-bold text-foreground block mb-1">
              {selectedOption === correctIndex ? "🎉 Correct!" : "❌ Incorrect"}
            </span>
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline AnimatePresence wrapper for convenience
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
