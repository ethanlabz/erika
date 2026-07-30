"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, ArrowRight, Layers, Database } from "lucide-react";

interface ExecutionSimulatorProps {
  defaultTab?: "memory" | "stack";
}

export function ExecutionSimulator({ defaultTab = "memory" }: ExecutionSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"memory" | "stack">(defaultTab);
  
  // Memory model state
  const [memModel, setMemModel] = useState<"box" | "tag">("tag");
  const [tagStep, setTagStep] = useState(0);

  // Stack simulation state
  const [stackStep, setStackStep] = useState(0);
  const stackSteps = [
    { instruction: "LOAD_FAST 0 (a)", stack: [], desc: "Push parameter 'a' (val: 10) onto stack." },
    { instruction: "LOAD_FAST 1 (b)", stack: ["10"], desc: "Push parameter 'b' (val: 20) onto stack." },
    { instruction: "BINARY_ADD", stack: ["20", "10"], desc: "Pop both values, perform addition, push result (30)." },
    { instruction: "RETURN_VALUE", stack: ["30"], desc: "Pop top of stack and return value 30 to caller." }
  ];

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-lg text-foreground">
      {/* Header Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        <button
          onClick={() => setActiveTab("memory")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
            activeTab === "memory"
              ? "border-primary text-primary bg-card"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" />
          Memory Model Visualizer
        </button>
        <button
          onClick={() => setActiveTab("stack")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
            activeTab === "stack"
              ? "border-primary text-primary bg-card"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          PVM Stack Simulator
        </button>
      </div>

      <div className="p-6">
        {activeTab === "memory" ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">C Box Model vs. Python Tag Model</h3>
                <p className="text-xs text-muted-foreground">
                  Understand how variables bind to data values in memory.
                </p>
              </div>
              <div className="flex gap-2 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setMemModel("box")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    memModel === "box" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  C (Box Model)
                </button>
                <button
                  onClick={() => setMemModel("tag")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    memModel === "tag" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Python (Tag Model)
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12 items-center min-h-[220px]">
              <div className="md:col-span-8 border border-dashed border-border rounded-lg p-4 bg-muted/10 flex flex-col justify-center min-h-[200px]">
                {memModel === "box" ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      In C, assignments write data directly into a fixed memory address on the stack.
                    </p>
                    <div className="flex gap-4 items-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono text-muted-foreground">Name: x</span>
                        <div className="w-24 h-16 border-2 border-primary rounded-md flex items-center justify-center bg-primary/5 relative">
                          <span className="font-mono text-lg font-bold">10</span>
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono text-muted-foreground">0x7ffe...</span>
                        </div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono text-muted-foreground">x = 20</span>
                        <div className="w-24 h-16 border-2 border-primary rounded-md flex items-center justify-center bg-primary/10 relative">
                          <motion.span 
                            key="c-val-change"
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-mono text-lg font-bold"
                          >
                            20
                          </motion.span>
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono text-muted-foreground">0x7ffe...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground">
                      In Python, variables are tags/references (sticky notes) pointing to immutable heap objects.
                    </p>
                    
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setTagStep(0)}
                        className={`px-2 py-0.5 rounded text-[10px] ${tagStep === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        Step 1: x = 1000
                      </button>
                      <button
                        onClick={() => setTagStep(1)}
                        className={`px-2 py-0.5 rounded text-[10px] ${tagStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        Step 2: y = x
                      </button>
                      <button
                        onClick={() => setTagStep(2)}
                        className={`px-2 py-0.5 rounded text-[10px] ${tagStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        Step 3: x = x + 1
                      </button>
                    </div>

                    <div className="relative h-28 border border-border rounded bg-muted/20 p-2 overflow-hidden">
                      {tagStep === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-12 items-center h-full pl-4">
                          <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono">Tag: x</div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-20 h-12 border border-border bg-card rounded flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[10px] text-muted-foreground">0x99A</span>
                            <span className="font-bold text-sm">1000</span>
                          </div>
                        </motion.div>
                      )}
                      {tagStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-12 items-center h-full pl-4">
                          <div className="flex flex-col gap-2">
                            <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono">Tag: x</div>
                            <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono">Tag: y</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-20 h-12 border border-border bg-card rounded flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[10px] text-muted-foreground">0x99A</span>
                            <span className="font-bold text-sm">1000</span>
                          </div>
                        </motion.div>
                      )}
                      {tagStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-center h-full gap-2 pl-4">
                          <div className="flex items-center gap-12">
                            <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono">Tag: y</div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="w-20 h-10 border border-border bg-card rounded flex flex-col items-center justify-center shadow-sm">
                              <span className="text-[9px] text-muted-foreground">0x99A</span>
                              <span className="font-bold text-xs">1000</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-12">
                            <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs font-mono">Tag: x</div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="w-20 h-10 border border-border bg-card rounded flex flex-col items-center justify-center shadow-sm border-primary">
                              <span className="text-[9px] text-primary">0x88C</span>
                              <span className="font-bold text-xs">1001</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-4 flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mechanism Details</span>
                <span className="text-sm font-medium">
                  {memModel === "box" 
                    ? "In-place stack updating keeps variable memory addresses constant." 
                    : "Reassignment creates new objects and shifts references, leaving old ones for garbage collection."
                  }
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {memModel === "box"
                    ? "Variable storage is static. Stack addresses do not change; only the contents inside the 'box' are replaced."
                    : "Since Python numbers are immutable, any modification forces a new allocation at a new heap location."
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Python Virtual Machine (PVM) Stack Trace</h3>
              <p className="text-xs text-muted-foreground">
                Step through the stack-based bytecode evaluation loop in the PVM.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-12 min-h-[220px]">
              {/* Stack visualization */}
              <div className="md:col-span-4 flex flex-col items-center justify-end border border-dashed border-border rounded-lg p-4 bg-muted/10 min-h-[200px]">
                <div className="w-full flex flex-col gap-1 items-center justify-end h-36">
                  <AnimatePresence mode="popLayout">
                    {stackSteps[stackStep].stack.map((item, idx) => (
                      <motion.div
                        key={`stack-item-${idx}-${item}`}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0 }}
                        className="w-28 py-2 bg-primary/20 border border-primary/50 text-foreground font-mono text-center rounded shadow-sm text-xs font-bold"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {stackSteps[stackStep].stack.length === 0 && (
                    <span className="text-xs text-muted-foreground italic mb-6">Stack is Empty</span>
                  )}
                </div>
                <div className="w-32 border-t-2 border-foreground mt-2 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Evaluation Stack
                </div>
              </div>

              {/* Bytecode list & description */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Execution Steps</span>
                  <div className="flex flex-col gap-1 font-mono text-xs">
                    {stackSteps.map((s, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded flex items-center justify-between transition-all ${
                          idx === stackStep
                            ? "bg-primary/10 border-l-4 border-primary text-foreground font-semibold"
                            : "text-muted-foreground opacity-60"
                        }`}
                      >
                        <span>{s.instruction}</span>
                        {idx === stackStep && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-sans">Active</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/20 border border-border rounded-md">
                  <span className="text-xs font-bold block mb-1">Step Description:</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stackSteps[stackStep].desc}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setStackStep((prev) => (prev > 0 ? prev - 1 : 0))}
                    disabled={stackStep === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-semibold hover:bg-muted disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setStackStep((prev) => (prev < stackSteps.length - 1 ? prev + 1 : prev))}
                    disabled={stackStep === stackSteps.length - 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition"
                  >
                    Next Step
                    <Play className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setStackStep(0)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-semibold hover:bg-muted transition ml-auto"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
