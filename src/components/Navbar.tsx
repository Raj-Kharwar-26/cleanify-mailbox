import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center group"
          aria-label="Home"
        >
          <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-primary-foreground font-bold text-xl">E</span>
          </div>
          <span className="font-semibold text-xl">CleanMail</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`link-underline font-medium ${isActive("/") ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`link-underline font-medium ${isActive("/features") ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`link-underline font-medium ${isActive("/pricing") ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}
          >
            Pricing
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" className="px-5">
                Log in
              </Button>
            </Link>
            <Link to="/login?signup=true">
              <Button className="px-5 animated-button">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>

        <button 
          className="md:hidden focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      <div 
        className={`fixed inset-0 bg-background md:hidden z-40 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "72px" }}
      >
        <nav className="flex flex-col h-full p-6 space-y-8 overflow-auto">
          <Link 
            to="/" 
            className={`text-lg font-medium ${isActive("/") ? "text-primary" : "text-foreground/80"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-lg font-medium ${isActive("/features") ? "text-primary" : "text-foreground/80"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`text-lg font-medium ${isActive("/pricing") ? "text-primary" : "text-foreground/80"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="flex flex-col space-y-3 pt-4">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link to="/login?signup=true" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full animated-button">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
