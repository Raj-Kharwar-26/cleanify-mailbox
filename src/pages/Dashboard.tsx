import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowUpRight, Check, CheckCircle, ChevronDown, ChevronRight, 
  Clock, Mail, Trash2, AlertCircle, Lock 
} from "lucide-react";
import { EmailService, EmailData, EmailStats } from "@/utils/EmailService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spamEmails, setSpamEmails] = useState<EmailData[]>([]);
  const [promotionalEmails, setPromotionalEmails] = useState<EmailData[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<{[id: string]: boolean}>({});

  // Email stats
  const [emailStats, setEmailStats] = useState<EmailStats>({
    total: 0,
    spam: 0,
    promotional: 0,
    unread: 0,
    storage: 0
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      
      // Check Gmail authentication
      const hasGmailAuth = EmailService.isAuthenticated();
      setIsAuthenticated(hasGmailAuth);
      
      if (hasGmailAuth) {
        try {
          // Fetch real email stats
          const stats = await EmailService.getEmailStats();
          if (stats) {
            setEmailStats(stats);
            
            // Fetch sample emails
            const spam = await EmailService.getSpamEmails(10);
            const promo = await EmailService.getPromotionalEmails(10);
            
            setSpamEmails(spam);
            setPromotionalEmails(promo);
          }
        } catch (error) {
          console.error("Error fetching email data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch your email data. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Use sample data for unauthenticated users
        setEmailStats({
          total: 1287,
          spam: 189,
          promotional: 567,
          unread: 42,
          storage: 65
        });
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleGmailConnect = () => {
    const authUrl = EmailService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleSelectEmail = (id: string) => {
    setSelectedEmails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCleanEmails = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account to clean emails.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Cleaning emails",
      description: "Your emails are being cleaned...",
    });
    
    try {
      // Get selected emails or all if none selected
      const spamToDelete = Object.keys(selectedEmails).filter(id => 
        selectedEmails[id] && spamEmails.some(email => email.id === id)
      );
      
      const promoToDelete = Object.keys(selectedEmails).filter(id => 
        selectedEmails[id] && promotionalEmails.some(email => email.id === id)
      );
      
      // Default to all if none selected
      const spamIds = spamToDelete.length > 0 ? spamToDelete : spamEmails.map(e => e.id);
      const promoIds = promoToDelete.length > 0 ? promoToDelete : [];
      
      const allIdsToDelete = [...spamIds, ...promoIds];
      
      if (allIdsToDelete.length === 0) {
        toast({
          title: "No emails selected",
          description: "Please select emails to clean or switch to the spam tab.",
        });
        return;
      }
      
      const success = await EmailService.deleteEmails(allIdsToDelete);
      
      if (success) {
        // Update stats
        setEmailStats(prev => ({
          ...prev,
          spam: prev.spam - spamIds.length,
          promotional: prev.promotional - promoIds.length,
          total: prev.total - allIdsToDelete.length,
        }));
        
        // Remove deleted emails from lists
        setSpamEmails(prev => prev.filter(email => !spamIds.includes(email.id)));
        setPromotionalEmails(prev => prev.filter(email => !promoIds.includes(email.id)));
        
        // Clear selection
        setSelectedEmails({});
        
        toast({
          title: "Emails cleaned successfully",
          description: `${allIdsToDelete.length} emails have been moved to trash.`,
        });
      } else {
        toast({
          title: "Failed to clean emails",
          description: "There was an error cleaning your emails. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cleaning emails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cleaning emails.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSpam = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account to delete spam.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Deleting spam emails",
      description: "Your spam emails are being deleted...",
    });
    
    try {
      const spamIds = spamEmails.map(email => email.id);
      const success = await EmailService.deleteEmails(spamIds);
      
      if (success) {
        setEmailStats(prev => ({
          ...prev,
          spam: 0,
          total: prev.total - prev.spam,
        }));
        
        setSpamEmails([]);
        
        toast({
          title: "Spam deleted",
          description: "All spam emails have been removed.",
        });
      } else {
        toast({
          title: "Failed to delete spam",
          description: "There was an error deleting your spam emails. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting spam:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting spam.",
        variant: "destructive",
      });
    }
  };

  const handleCleanPromotional = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account to clean promotional emails.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Cleaning promotional emails",
      description: "Your promotional emails are being cleaned...",
    });
    
    try {
      const promoIds = promotionalEmails.map(email => email.id);
      const success = await EmailService.deleteEmails(promoIds);
      
      if (success) {
        setEmailStats(prev => ({
          ...prev,
          promotional: Math.max(0, prev.promotional - promoIds.length),
          total: prev.total - promoIds.length,
        }));
        
        setPromotionalEmails([]);
        
        toast({
          title: "Promotional emails cleaned",
          description: "All promotional emails have been removed.",
        });
      } else {
        toast({
          title: "Failed to clean promotional emails",
          description: "There was an error cleaning your promotional emails. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cleaning promotional emails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cleaning promotional emails.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium">Loading your email data...</h2>
            <p className="text-foreground/70 mt-2">This will just take a moment</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="container-custom">
          {!isAuthenticated && (
            <Alert className="mb-8 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <AlertTitle>Connect your Gmail account</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-4">
                <p>To clean your actual emails, you need to connect your Gmail account. This will allow CleanMail to access and clean your emails.</p>
                <Button onClick={handleGmailConnect} className="w-full sm:w-auto">
                  <Lock className="mr-2 h-4 w-4" /> Connect Gmail Account
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 md:p-8 mb-8">
                <h1 className="text-2xl font-bold mb-6">Email Dashboard</h1>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="spam">Spam</TabsTrigger>
                    <TabsTrigger value="promotional">Promotional</TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-secondary/50 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium">Total Emails</h3>
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold mb-1">{emailStats.total.toLocaleString()}</p>
                        <div className="text-sm text-foreground/60">
                          <span className="text-foreground font-medium">{emailStats.unread} </span>
                          unread
                        </div>
                      </div>
                      
                      <div className="bg-secondary/50 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium">Storage Used</h3>
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold mb-1">{emailStats.storage}%</p>
                        <Progress value={emailStats.storage} className="h-2 mb-1" />
                        <div className="text-sm text-foreground/60">
                          of your 15GB quota
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <h3 className="font-medium mb-4">Emails by Category</h3>
                      
                      <div className="flex items-center bg-secondary/50 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4">
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">Spam</h4>
                            <span className="font-medium">{emailStats.spam.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(emailStats.spam / emailStats.total) * 100} 
                            className="h-1.5 bg-red-200 dark:bg-red-950/50"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-secondary/50 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mr-4">
                          <Mail className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">Promotional</h4>
                            <span className="font-medium">{emailStats.promotional.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(emailStats.promotional / emailStats.total) * 100} 
                            className="h-1.5 bg-orange-200 dark:bg-orange-950/50"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-secondary/50 rounded-lg p-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4">
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">Important</h4>
                            <span className="font-medium">
                              {(emailStats.total - emailStats.spam - emailStats.promotional).toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={((emailStats.total - emailStats.spam - emailStats.promotional) / emailStats.total) * 100} 
                            className="h-1.5 bg-blue-200 dark:bg-blue-950/50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full animated-button py-6"
                      onClick={handleCleanEmails}
                    >
                      Clean Emails
                    </Button>
                  </TabsContent>
                  
                  {/* Spam Tab */}
                  <TabsContent value="spam" className="mt-0">
                    <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Spam Emails</h3>
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="text-3xl font-bold mb-4">{emailStats.spam.toLocaleString()}</p>
                      <p className="text-foreground/70 mb-6">
                        These emails were identified as spam and can be safely removed.
                      </p>
                      <Button 
                        className="w-full"
                        variant="destructive"
                        onClick={handleDeleteSpam}
                      >
                        Delete All Spam
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium mb-4">
                        {isAuthenticated ? 'Your Spam Emails' : 'Sample Spam Emails'}
                      </h3>
                      
                      {emailStats.spam > 0 ? (
                        <>
                          {isAuthenticated ? (
                            spamEmails.map((email) => (
                              <div 
                                key={email.id} 
                                className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4"
                                onClick={() => handleSelectEmail(email.id)}
                              >
                                <div className="flex justify-between mb-1">
                                  <h4 className="font-medium truncate mr-4">{email.subject}</h4>
                                  <Check 
                                    className={`h-4 w-4 ${selectedEmails[email.id] ? 'text-green-500' : 'text-red-500'} flex-shrink-0`} 
                                  />
                                </div>
                                <p className="text-sm text-foreground/70 truncate">{email.from}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              {[
                                { subject: "You've WON a FREE iPhone 15 Pro!!!", sender: "prizes@winbig-now.com" },
                                { subject: "URGENT: Your Account Needs Verification", sender: "secure-verify@bank-alerts.net" },
                                { subject: "Make $5000 Daily From Home - Guaranteed!", sender: "wealth@easy-money.biz" },
                              ].map((email, index) => (
                                <div 
                                  key={index} 
                                  className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4"
                                >
                                  <div className="flex justify-between mb-1">
                                    <h4 className="font-medium truncate mr-4">{email.subject}</h4>
                                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                                  </div>
                                  <p className="text-sm text-foreground/70 truncate">{email.sender}</p>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="bg-secondary/50 rounded-lg p-6 text-center">
                          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                          <h4 className="font-medium text-lg mb-2">No Spam Emails</h4>
                          <p className="text-foreground/70">
                            Great job! Your inbox is free of spam emails.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Promotional Tab */}
                  <TabsContent value="promotional" className="mt-0">
                    <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Promotional Emails</h3>
                        <Mail className="h-5 w-5 text-orange-500" />
                      </div>
                      <p className="text-3xl font-bold mb-4">{emailStats.promotional.toLocaleString()}</p>
                      <p className="text-foreground/70 mb-6">
                        Marketing emails, newsletters, and offers from various services.
                      </p>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={handleCleanPromotional}
                      >
                        Clean Promotional Emails
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium mb-4">
                        {isAuthenticated ? 'Your Promotional Emails' : 'Sample Promotional Emails'}
                      </h3>
                      
                      {emailStats.promotional > 0 ? (
                        <>
                          {isAuthenticated ? (
                            promotionalEmails.map((email) => (
                              <div 
                                key={email.id} 
                                className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-lg p-4"
                                onClick={() => handleSelectEmail(email.id)}
                              >
                                <div className="flex justify-between mb-1">
                                  <h4 className="font-medium truncate mr-4">{email.subject}</h4>
                                  <Check 
                                    className={`h-4 w-4 ${selectedEmails[email.id] ? 'text-green-500' : 'text-orange-500'} flex-shrink-0`} 
                                  />
                                </div>
                                <p className="text-sm text-foreground/70 truncate">{email.from}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              {[
                                { subject: "FLASH SALE: 70% OFF EVERYTHING!", sender: "deals@fashion-store.com" },
                                { subject: "Limited Time Offer - Act Now!", sender: "newsletter@tech-gadgets.com" },
                                { subject: "New arrivals just for you", sender: "updates@footwear-brand.com" },
                              ].map((email, index) => (
                                <div 
                                  key={index} 
                                  className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-lg p-4"
                                >
                                  <div className="flex justify-between mb-1">
                                    <h4 className="font-medium truncate mr-4">{email.subject}</h4>
                                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  </div>
                                  <p className="text-sm text-foreground/70 truncate">{email.sender}</p>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="bg-secondary/50 rounded-lg p-6 text-center">
                          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                          <h4 className="font-medium text-lg mb-2">No Promotional Emails</h4>
                          <p className="text-foreground/70">
                            Your inbox is free of promotional clutter.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 md:p-8 mb-8">
                <h3 className="text-xl font-bold mb-6">Action Center</h3>
                
                <div className="space-y-4">
                  <button className="w-full bg-secondary/80 hover:bg-secondary rounded-lg p-4 text-left transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Schedule Cleaning</h4>
                        <p className="text-sm text-foreground/70">Set automatic cleanup</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground/70 transition-all" />
                  </button>
                  
                  <button className="w-full bg-secondary/80 hover:bg-secondary rounded-lg p-4 text-left transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <Trash2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Bulk Unsubscribe</h4>
                        <p className="text-sm text-foreground/70">Remove from mailing lists</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground/70 transition-all" />
                  </button>
                  
                  <button className="w-full bg-secondary/80 hover:bg-secondary rounded-lg p-4 text-left transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Add More Accounts</h4>
                        <p className="text-sm text-foreground/70">Manage multiple emails</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground/70 transition-all" />
                  </button>
                </div>
              </div>
              
              <div className="glass-panel p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Cleaning Stats</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm text-foreground/70">Emails Analyzed</h4>
                      <span className="font-medium">{emailStats.total.toLocaleString()}</span>
                    </div>
                    <Progress value={100} className="h-1.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm text-foreground/70">Spam Identified</h4>
                      <span className="font-medium">{emailStats.spam.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(emailStats.spam / emailStats.total) * 100} 
                      className="h-1.5 bg-red-200 dark:bg-red-950/50"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm text-foreground/70">Promotions Detected</h4>
                      <span className="font-medium">{emailStats.promotional.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(emailStats.promotional / emailStats.total) * 100} 
                      className="h-1.5 bg-orange-200 dark:bg-orange-950/50"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Potential Space Savings</h4>
                      <ChevronDown className="h-5 w-5 text-foreground/60" />
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">4.2</span>
                      <span className="text-foreground/70">GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
