"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export function LandingPage() {
  return (
    <>
      <SiteHeader showAuthLinks />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Main content */}
        <div className="relative max-w-lg mx-auto px-8 py-16">
          <div className="text-center space-y-16">
            {/* Abstract line illustration */}
            <div className="relative mb-12">
              <svg
                viewBox="0 0 200 100"
                className="w-32 h-32 mx-auto opacity-90 stroke-foreground"
                fill="none"
                strokeWidth="0.5"
              >
                <path
                  d="M100,10 C100,50 150,50 150,90 M100,10 C100,50 50,50 50,90"
                  className="animate-draw"
                />
                <circle 
                  cx="100" 
                  cy="10" 
                  r="5" 
                  className="fill-foreground"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl font-heading font-light tracking-tight leading-none text-foreground/90">
                NOSTALGIA
              </h1>
              <h2 className="font-handwritten text-muted-foreground">
                Capture. Journal. Relive.<br /> 
                Shared Moments, Timeless Stories!
              </h2>
            </div>

            {/* Subtle divider */}
            <div className="w-px h-16 bg-foreground/10 mx-auto" />

            {/* CTA */}
            <div className="space-y-8">
              <Button
                asChild
                variant="ghost"
                className="text-lg tracking-[0.2em] px-12 py-8 h-auto 
                  border border-foreground/10 
                  hover:bg-foreground/5 
                  dark:hover:bg-foreground/[0.15]
                  transition-all duration-300"
              >
                <Link href="/register">BEGIN YOUR STORY</Link>
              </Button>

              <p className="text-sm tracking-wider text-muted-foreground">
                Already have memories?{" "}
                <Link
                  href="/login"
                  className="text-foreground underline-offset-4 
                    hover:underline transition-colors 
                    hover:text-foreground/80"
                >
                  Continue writing
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Top gradient */}
          <div 
            className="absolute top-0 left-0 right-0 h-[400px] 
              bg-gradient-to-b from-foreground/[0.02] to-transparent 
              dark:from-foreground/[0.05]"
          />
          
          {/* Bottom gradient */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[400px] 
              bg-gradient-to-t from-foreground/[0.02] to-transparent
              dark:from-foreground/[0.05]"
          />
          
          {/* Subtle radial gradient */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--tw-gradient-from)_100%)] 
              from-foreground/[0.03] dark:from-foreground/[0.07]"
          />
        </div>
      </div>
    </>
  );
}