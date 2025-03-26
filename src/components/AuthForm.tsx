
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("signup") === "true" ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page refresh
    const newUrl = value === "signup" ? "/login?signup=true" : "/login";
    window.history.replaceState(null, "", newUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "login") {
      await signIn(formData.email, formData.password);
    } else {
      await signUp(formData.email, formData.password, formData.name);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
      
      setIsResetOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login" className="text-base py-3">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-base py-3">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="input-wrapper flex items-center pr-3">
                <div className="px-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Sheet open={isResetOpen} onOpenChange={setIsResetOpen}>
                  <SheetTrigger asChild>
                    <button 
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Reset Password</SheetTitle>
                      <SheetDescription>Enter your email to receive a password reset link.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleResetPassword} className="space-y-6 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="name@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Send Reset Link</Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="input-wrapper flex items-center pr-3">
                <div className="px-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePasswordVisibility}
                  className="h-9 w-9"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 animated-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="input-wrapper flex items-center pr-3">
                <div className="px-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">Email</Label>
              <div className="input-wrapper flex items-center pr-3">
                <div className="px-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email-signup"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password</Label>
              <div className="input-wrapper flex items-center pr-3">
                <div className="px-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password-signup"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePasswordVisibility}
                  className="h-9 w-9"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 animated-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-sm text-foreground/70">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
