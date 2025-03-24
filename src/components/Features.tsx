
import { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Inbox, Layers, Trash2, TrendingUp } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Trash2,
    title: "Bulk Clean",
    description: "Remove thousands of unwanted emails in seconds with our intelligent bulk cleaning tool.",
  },
  {
    icon: Layers,
    title: "Smart Categorization",
    description: "Automatically sort emails into categories like promotions, social, spam, and important.",
  },
  {
    icon: Clock,
    title: "Scheduled Cleaning",
    description: "Set up regular cleaning schedules to keep your inbox tidy without manual effort.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Gain insights into your email habits with visual analytics and improvement suggestions.",
  },
  {
    icon: Inbox,
    title: "Multiple Inbox Support",
    description: "Manage and clean multiple email accounts from a single dashboard interface.",
  },
  {
    icon: CheckCircle,
    title: "One-Click Unsubscribe",
    description: "Easily unsubscribe from unwanted newsletters and mailing lists with a single click.",
  },
];

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section bg-secondary/50" ref={featuresRef}>
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-16">
          <div 
            className={`inline-block bg-primary/10 px-4 py-1 rounded-full mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-primary font-medium text-sm">Key Features</span>
          </div>
          <h2 
            className={`text-3xl md:text-4xl font-bold mb-6 max-w-3xl transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Everything You Need to Maintain a Clean Inbox
          </h2>
          <p 
            className={`text-lg text-foreground/80 mb-0 max-w-2xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            CleanMail provides powerful tools designed to simplify email management
            and help you focus on what truly matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`glass-panel p-6 md:p-8 transition-all duration-700 delay-${
                  300 + index * 100
                } ${
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/80">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
