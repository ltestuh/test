"use client";

import { useAuth } from "@/lib/auth-context";
import { HomeContent } from "@/components/home-content";
import { LandingPage } from "@/components/landing-page";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LandingPage />;
  }

  return <HomeContent />;
}