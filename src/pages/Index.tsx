
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        
        {/* Call to Action Section */}
        <section className="section">
          <div className="container-custom">
            <div className="glass-panel p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto">
                Ready to Experience a <span className="text-gradient">Clean Inbox</span>?
              </h2>
              <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
                Join thousands of users who have reclaimed their inbox and saved countless hours managing emails.
              </p>
              <Link to="/login?signup=true">
                <Button className="text-base h-12 px-8 animated-button font-medium">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-secondary/50 py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 opacity-80"></div>
                    <span className="relative text-primary-foreground font-bold text-xl">E</span>
                  </div>
                  <span className="font-semibold text-xl">CleanMail</span>
                </div>
                <p className="text-foreground/70 max-w-xs">
                  Simplifying email management with intelligent tools to keep your inbox clean and organized.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/features" className="text-foreground/70 hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-foreground/70 hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-foreground/60 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} CleanMail. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                  Terms
                </a>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                  Privacy
                </a>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
