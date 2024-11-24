"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BookHeart } from "lucide-react";
import { auth, LoginData } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await auth.login(formData);
      
      if (response.success && response.data?.access_token) {
        // No need to manually set token here as it's handled in auth.login
        await login(response.data.access_token);
        toast({
          title: "Success",
          description: "Welcome back!",
        });
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader showAuthLinks />
      <div className="container max-w-md mx-auto px-4 py-24">
        <Card className="p-8 bg-transparent border border-white/10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <BookHeart className="h-12 w-12" />
            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-tight">SIGN IN</h1>
              <p className="text-sm tracking-wider text-white/50">
                Continue your journey
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm tracking-wider">USERNAME</Label>
              <Input
                id="username"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="bg-transparent border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm tracking-wider">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="bg-transparent border-white/10"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full tracking-widest border border-white/10" 
              variant="ghost"
              disabled={isLoading}
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Button>

            <p className="text-center text-sm tracking-wider text-white/50">
              Don't have an account?{" "}
              <Link href="/register" className="text-white hover:underline underline-offset-4">
                Register
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}