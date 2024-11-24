"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Feather, ScrollText, Shield, Check, X } from "lucide-react";
import { auth, RegisterData } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type RegistrationStep = 'name' | 'username' | 'email' | 'password';

interface StepContent {
  title: string;
  subtitle: string;
  placeholder: string;
  icon: JSX.Element;
}

interface RegistrationFormData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  const steps: Record<RegistrationStep, StepContent> = {
    name: {
      title: "Every great story begins with a name",
      subtitle: "What shall we call you, brave soul?",
      placeholder: "Your name",
      icon: <Feather className="h-6 w-6" />
    },
    username: {
      title: "A hero needs a title",
      subtitle: "Choose how you'll be known in the chronicles",
      placeholder: "Your chosen identity",
      icon: <ScrollText className="h-6 w-6" />
    },
    email: {
      title: "A scroll for your tales",
      subtitle: "Where shall we send word of your adventures?",
      placeholder: "Your message scroll (email)",
      icon: <ScrollText className="h-6 w-6" />
    },
    password: {
      title: "The final seal",
      subtitle: "Create a key to protect your chronicles",
      placeholder: "Your secret key",
      icon: <Shield className="h-6 w-6" />
    }
  };

  const handleNext = () => {
    const stepOrder: RegistrationStep[] = ['name', 'username', 'email', 'password'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(stepOrder[currentIndex + 1]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== 'password') {
      handleNext();
      return;
    }

    setIsLoading(true);

    try {
      const { name, ...registrationData } = formData;
      const response = await auth.register({ name, ...registrationData });
      
      if (response.success) {
        toast({
          title: "The Journey Begins!",
          description: "Your story awaits...",
        });
        router.push("/login");
      } else {
        throw new Error(response.error || "Failed to join the adventure");
      }
    } catch (error) {
      toast({
        title: "A Setback",
        description: error instanceof Error ? error.message : "Failed to join",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentValue = () => formData[currentStep] || '';

  const updateField = (value: string) => {
    setFormData(prev => ({ ...prev, [currentStep]: value }));
  };

  const checkUsername = async (username: string) => {
    if (!username) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await auth.checkUsername(username);
      if (response.success && response.data) {
        setUsernameAvailable(response.data.available);
      }
    } catch (error) {
      console.error('Failed to check username:', error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    updateField(value);
    
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce the username check
    if (currentStep === 'username') {
      debounceTimeout.current = setTimeout(() => {
        checkUsername(value);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="relative container max-w-4xl mx-auto px-4 py-24">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {(['name', 'username', 'email', 'password'] as const).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                currentStep === step ? "bg-primary/70" : "bg-primary/20"
              )} />
              {index < 3 && (
                <div className={cn(
                  "w-12 h-px mx-1 transition-all duration-500",
                  index < ['name', 'username', 'email', 'password'].indexOf(currentStep) 
                    ? "bg-primary/40" 
                    : "bg-primary/10"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-24">
          <div 
            className={cn(
              "space-y-12 transition-all duration-300",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            <div className="text-center space-y-4">
              <div className={cn(
                "inline-block transition-transform duration-300",
                isTransitioning ? "scale-95" : "scale-100"
              )}>
                {steps[currentStep].icon}
              </div>
              <h1 className="text-4xl font-light tracking-wide">
                {steps[currentStep].title}
              </h1>
              <p className="text-base text-muted-foreground/70 tracking-wider max-w-md mx-auto">
                {steps[currentStep].subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="relative group">
                <Input
                  type={currentStep === 'email' ? 'email' : 
                        currentStep === 'password' ? 'password' : 'text'}
                  required
                  value={getCurrentValue()}
                  onChange={(e) => currentStep === 'username' 
                    ? handleUsernameChange(e.target.value)
                    : updateField(e.target.value)
                  }
                  className={cn(
                    "bg-transparent border-primary/20 focus:border-primary/40 pr-12 h-14 text-lg tracking-wide text-center",
                    "placeholder:text-muted-foreground/40",
                    currentStep === 'username' && usernameAvailable !== null && (
                      usernameAvailable 
                        ? "border-green-500/50 focus:border-green-500/70"
                        : "border-red-500/50 focus:border-red-500/70"
                    )
                  )}
                  placeholder={steps[currentStep].placeholder}
                />
                
                {currentStep === 'username' && (
                  <div className="absolute right-14 top-0 h-full flex items-center">
                    {isCheckingUsername ? (
                      <Sparkles className="h-4 w-4 text-muted-foreground/40 animate-pulse" />
                    ) : usernameAvailable !== null && (
                      usernameAvailable ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )
                    )}
                  </div>
                )}

                <Button 
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-full aspect-square 
                    bg-transparent hover:bg-primary/5 border-l border-primary/20
                    rounded-l-none transition-all duration-300
                    group-hover:border-primary/40"
                  disabled={!getCurrentValue() || isLoading || 
                    (currentStep === 'username' && (isCheckingUsername || usernameAvailable === false))}
                >
                  {isLoading ? (
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center transition-opacity duration-300 delay-150">
                {currentStep === 'username' && usernameAvailable === false ? (
                  <p className="text-sm text-red-500/70 tracking-wider">
                    This identity is already taken
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 tracking-wider">
                    {currentStep === 'password' ? 'PRESS ENTER TO BEGIN YOUR JOURNEY' : 'PRESS ENTER TO CONTINUE'}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}