
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Mail, Search, Settings, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [emailInput, setEmailInput] = useState("");

  // Generate user initials from user's full name or email
  const getUserInitials = () => {
    if (!user) return "JD";

    // Check for user metadata (full_name)
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      const nameParts = fullName.split(" ");
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
        : fullName.substring(0, 2);
      return initials.toUpperCase();
    }

    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return "JD"; // Default fallback
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      toast({
        title: "Email added",
        description: `${emailInput} has been added to your dashboard.`,
      });
      setEmailInput("");
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo with Link to homepage */}
          <Link to="/" className="flex items-center group">
            <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-semibold text-xl hidden sm:inline-block">CleanMail</span>
          </Link>

          {/* Email input form */}
          <form onSubmit={handleEmailSubmit} className="flex-1 max-w-lg">
            <div className="input-wrapper flex items-center">
              <div className="px-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="email"
                placeholder="Add an email address to manage"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                disabled={!emailInput}
              >
                Add
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => toast({ title: "Search", description: "Search functionality would go here" })}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => toast({ title: "Notifications", description: "Notification functionality would go here" })}
            >
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "Profile", description: "Profile functionality would go here" })}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Settings", description: "Settings functionality would go here" })}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
