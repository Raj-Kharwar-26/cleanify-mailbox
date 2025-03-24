
import { ArrowRight, CheckCircle, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-40 md:pb-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-20 h-[30rem] w-[30rem] rounded-full bg-primary"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 blur-3xl opacity-20 h-[30rem] w-[30rem] rounded-full bg-blue-400"></div>
      </div>

      <div className="container-custom">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow text */}
          <div 
            className={`bg-secondary/80 backdrop-blur px-4 py-1 rounded-full mb-8 transform transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-primary font-medium text-sm">
              Introducing CleanMail — Declutter your inbox
            </span>
          </div>

          {/* Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 max-w-4xl transform transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Keep Your Inbox <span className="text-gradient">Clean & Organized</span> Without the Hassle
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl transform transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Effortlessly eliminate spam, promotional, and unnecessary emails with our intelligent filtering system. Take back control of your inbox today.
          </p>

          {/* CTA buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 mb-16 transform transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link to="/login?signup=true">
              <Button className="text-base h-12 px-8 animated-button font-medium">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="text-base h-12 px-8 font-medium">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Email cleaning illustration/animation */}
          <div 
            className={`relative w-full max-w-5xl h-[340px] md:h-[440px] glass-panel overflow-hidden transform transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="absolute inset-0 p-6 md:p-10">
              <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {/* Left side: Before */}
                <div className="flex flex-col h-full">
                  <h3 className="flex items-center text-lg font-semibold mb-4">
                    <Mail className="mr-2 h-5 w-5 text-red-500" />
                    Cluttered Inbox
                  </h3>
                  <div className="flex-1 overflow-hidden bg-secondary/50 rounded-lg p-4">
                    <div className="space-y-3">
                      {[
                        { type: "promo", subject: "FLASH SALE: 70% OFF EVERYTHING!" },
                        { type: "spam", subject: "You've WON a FREE iPhone 15 Pro!!!" },
                        { type: "news", subject: "Your Daily Newsletter: 15 New Updates" },
                        { type: "promo", subject: "Limited Time Offer - Act Now!" },
                        { type: "spam", subject: "Urgent: Your Account Needs Verification" },
                        { type: "promo", subject: "New arrivals just for you" },
                        { type: "news", subject: "Weekly Digest: Industry Updates" },
                        { type: "spam", subject: "Your Package Delivery Status" },
                      ].map((email, index) => (
                        <div 
                          key={index}
                          className={`flex items-center p-3 rounded-md ${
                            email.type === "spam" 
                              ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30" 
                              : email.type === "promo" 
                                ? "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/30"
                                : "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/30"
                          }`}
                        >
                          <div className="flex-1 truncate text-sm">
                            {email.subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: After */}
                <div className="flex flex-col h-full">
                  <h3 className="flex items-center text-lg font-semibold mb-4">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Clean Inbox
                  </h3>
                  <div className="flex-1 overflow-hidden bg-secondary/50 rounded-lg p-4">
                    <div className="space-y-3">
                      {[
                        { subject: "Project Update: Q3 Roadmap" },
                        { subject: "Meeting Notes: Product Team Sync" },
                        { subject: "Important: Client Presentation Tomorrow" },
                      ].map((email, index) => (
                        <div 
                          key={index}
                          className="flex items-center p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-1 truncate text-sm">
                            {email.subject}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-center py-4">
                        <Trash2 className="h-6 w-6 text-primary/60 mr-2" />
                        <span className="text-sm text-foreground/70 font-medium">
                          5 spam emails removed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
