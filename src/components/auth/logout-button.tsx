'use client'

import { useState, useRef, useEffect } from 'react'
import { animate } from 'animejs'
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client' // 🟢 NEW: Import Supabase client

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient() // 🟢 NEW: Initialize client

  // Anime.js Entry Animation
  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [0, 1],
        ease: 'outSine',
        duration: 200
      })
      animate(modalRef.current, {
        opacity: [0, 1],
        scale: [0.95, 1],
        translateY: [10, 0],
        ease: 'outBack', 
        duration: 400
      })
    }
  }, [isOpen])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      
      await supabase.auth.signOut()
      
      window.location.href = '/'
      
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <>
      {/* Sidebar Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-95"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* Modal Portal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Blurred Backdrop */}
          <div 
            ref={backdropRef}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !isSigningOut && setIsOpen(false)}
          />
          
          {/* Modal Card */}
          <div 
            ref={modalRef}
            className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">End Session?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                You will need to re-authenticate with GitHub to access the documentation again.
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isSigningOut}
                  className="flex-1 rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-80"
                >
                  {isSigningOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}