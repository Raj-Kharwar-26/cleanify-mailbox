
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGmailAuth } from "@/hooks/use-gmail-auth";
import { 
  ArrowUpRight, Check, CheckCircle, ChevronDown, ChevronRight, 
  Clock, Mail, Trash2, AlertCircle, Lock, Undo
} from "lucide-react";
import { EmailService, EmailData, EmailStats } from "@/utils/EmailService";
import EmailList from "@/components/EmailList";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, handleGmailConnect } = useGmailAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [fetchingEmails, setFetchingEmails] = useState(false);
  const [spamEmails, setSpamEmails] = useState<EmailData[]>([]);
  const [promotionalEmails, setPromotionalEmails] = useState<EmailData[]>([]);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const [undoTimer, setUndoTimer] = useState<number | null>(null);

  // Email stats
  const [emailStats, setEmailStats] = useState<EmailStats>({
    total: 0,
    spam: 0,
    promotional: 0,
    unread: 0,
    storage: 0
  });

  // Check authentication and load initial data
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      
      // Load initial stats
      await fetchEmailStats();
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Fetch data when tab changes
  useEffect(() => {
    const fetchDataForTab = async () => {
      if (activeTab === "spam") {
        await fetchSpamEmails();
      } else if (activeTab === "promotional") {
        await fetchPromotionalEmails();
      }
    };

    if (!loading && isAuthenticated) {
      fetchDataForTab();
    }
  }, [activeTab, isAuthenticated, loading]);

  // Handle undo timer
  useEffect(() => {
    return () => {
      // Clear any active timer when component unmounts
      if (undoTimer) {
        clearTimeout(undoTimer);
      }
    };
  }, [undoTimer]);

  const fetchEmailStats = async () => {
    try {
      const stats = await EmailService.getEmailStats();
      if (stats) {
        setEmailStats(stats);
      }
    } catch (error) {
      console.error("Error fetching email data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your email data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchSpamEmails = async () => {
    if (!isAuthenticated) return;
    
    setFetchingEmails(true);
    try {
      const emails = await EmailService.getSpamEmails(100);
      setSpamEmails(emails);
    } catch (error) {
      console.error("Error fetching spam emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch spam emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFetchingEmails(false);
    }
  };

  const fetchPromotionalEmails = async () => {
    if (!isAuthenticated) return;
    
    setFetchingEmails(true);
    try {
      const emails = await EmailService.getPromotionalEmails(100);
      setPromotionalEmails(emails);
    } catch (error) {
      console.error("Error fetching promotional emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch promotional emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFetchingEmails(false);
    }
  };

  const handleSelectEmail = (id: string, selected: boolean) => {
    if (activeTab === 'spam') {
      setSpamEmails(prev => 
        prev.map(email => 
          email.id === id ? { ...email, selected } : email
        )
      );
    } else if (activeTab === 'promotional') {
      setPromotionalEmails(prev => 
        prev.map(email => 
          email.id === id ? { ...email, selected } : email
        )
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account to delete emails.",
        variant: "destructive",
      });
      return;
    }
    
    const currentTab = activeTab as 'spam' | 'promotional';
    const emails = currentTab === 'spam' ? spamEmails : promotionalEmails;
    const selectedIds = emails
      .filter(email => email.selected)
      .map(email => email.id);
    
    if (selectedIds.length === 0) {
      toast({
        title: "No emails selected",
        description: "Please select emails to delete.",
      });
      return;
    }
    
    // Show info toast
    toast({
      title: `Deleting ${selectedIds.length} emails`,
      description: "Your selected emails are being deleted...",
    });
    
    try {
      const success = await EmailService.deleteEmails(selectedIds, currentTab);
      
      if (success) {
        // Remove deleted emails from state
        if (currentTab === 'spam') {
          setSpamEmails(prev => prev.filter(email => !selectedIds.includes(email.id)));
          
          // Update stats
          setEmailStats(prev => ({
            ...prev,
            spam: prev.spam - selectedIds.length,
            total: prev.total - selectedIds.length
          }));
        } else {
          setPromotionalEmails(prev => prev.filter(email => !selectedIds.includes(email.id)));
          
          // Update stats
          setEmailStats(prev => ({
            ...prev,
            promotional: prev.promotional - selectedIds.length,
            total: prev.total - selectedIds.length
          }));
        }
        
        // Show success toast
        toast({
          title: "Emails deleted",
          description: `${selectedIds.length} emails have been moved to trash.`,
        });
        
        // Enable undo button and set timer
        setShowUndoButton(true);
        
        // Clear any existing timer
        if (undoTimer) {
          clearTimeout(undoTimer);
        }
        
        // Set new timer for 10 seconds
        const timer = setTimeout(() => {
          setShowUndoButton(false);
        }, 10000);
        
        setUndoTimer(timer as unknown as number);
      } else {
        toast({
          title: "Failed to delete emails",
          description: "There was an error deleting your emails. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting emails.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account to delete emails.",
        variant: "destructive",
      });
      return;
    }
    
    const currentTab = activeTab as 'spam' | 'promotional';
    const emails = currentTab === 'spam' ? spamEmails : promotionalEmails;
    
    if (emails.length === 0) {
      toast({
        title: "No emails to delete",
        description: `Your ${currentTab} folder is already empty.`,
      });
      return;
    }
    
    // Show info toast
    toast({
      title: `Deleting all ${currentTab} emails`,
      description: `All your ${currentTab} emails are being deleted...`,
    });
    
    try {
      const emailIds = emails.map(email => email.id);
      const success = await EmailService.deleteEmails(emailIds, currentTab);
      
      if (success) {
        // Clear emails from state
        if (currentTab === 'spam') {
          setSpamEmails([]);
          
          // Update stats
          setEmailStats(prev => ({
            ...prev,
            spam: 0,
            total: prev.total - prev.spam
          }));
        } else {
          setPromotionalEmails([]);
          
          // Update stats
          setEmailStats(prev => ({
            ...prev,
            promotional: 0,
            total: prev.total - prev.promotional
          }));
        }
        
        // Show success toast
        toast({
          title: "Emails deleted",
          description: `All ${currentTab} emails have been moved to trash.`,
        });
        
        // Enable undo button and set timer
        setShowUndoButton(true);
        
        // Clear any existing timer
        if (undoTimer) {
          clearTimeout(undoTimer);
        }
        
        // Set new timer for 10 seconds
        const timer = setTimeout(() => {
          setShowUndoButton(false);
        }, 10000);
        
        setUndoTimer(timer as unknown as number);
      } else {
        toast({
          title: "Failed to delete emails",
          description: "There was an error deleting your emails. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting emails.",
        variant: "destructive",
      });
    }
  };

  const handleUndo = async () => {
    try {
      const result = await EmailService.undoRecentDeletion();
      
      if (result.success) {
        toast({
          title: "Deletion undone",
          description: `${result.count} emails have been restored.`,
        });
        
        // Refresh the current email list
        if (activeTab === 'spam') {
          await fetchSpamEmails();
        } else if (activeTab === 'promotional') {
          await fetchPromotionalEmails();
        }
        
        // Also refresh email stats
        await fetchEmailStats();
        
        // Hide undo button
        setShowUndoButton(false);
        
        // Clear timer
        if (undoTimer) {
          clearTimeout(undoTimer);
          setUndoTimer(null);
        }
      } else {
        toast({
          title: "Undo failed",
          description: "Unable to restore the deleted emails. They may have been permanently removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error undoing deletion:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while trying to restore emails.",
        variant: "destructive",
      });
    }
  };

  const getSelectedCount = () => {
    const emails = activeTab === 'spam' ? spamEmails : promotionalEmails;
    return emails.filter(email => email.selected).length;
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
          
          {showUndoButton && (
            <Alert className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
              <AlertTitle>Emails deleted</AlertTitle>
              <AlertDescription className="mt-2 flex justify-between items-center">
                <span>Your emails have been moved to trash.</span>
                <Button variant="outline" size="sm" onClick={handleUndo}>
                  <Undo className="mr-2 h-4 w-4" /> Undo
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
                            value={(emailStats.spam / Math.max(1, emailStats.total)) * 100} 
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
                            value={(emailStats.promotional / Math.max(1, emailStats.total)) * 100} 
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
                            value={((emailStats.total - emailStats.spam - emailStats.promotional) / Math.max(1, emailStats.total)) * 100} 
                            className="h-1.5 bg-blue-200 dark:bg-blue-950/50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="w-full py-6 bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          setActiveTab('spam');
                        }}
                      >
                        <Trash2 className="h-5 w-5 mr-2" /> Clean Spam
                      </Button>
                      
                      <Button 
                        className="w-full py-6 bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          setActiveTab('promotional');
                        }}
                      >
                        <Mail className="h-5 w-5 mr-2" /> Clean Promotional
                      </Button>
                    </div>
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
                    </div>
                    
                    <EmailList
                      emails={spamEmails}
                      category="spam"
                      isLoading={fetchingEmails}
                      onSelectEmail={handleSelectEmail}
                      onDeleteSelected={handleDeleteSelected}
                      onDeleteAll={handleDeleteAll}
                      selectedCount={getSelectedCount()}
                    />
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
                    </div>
                    
                    <EmailList
                      emails={promotionalEmails}
                      category="promotional"
                      isLoading={fetchingEmails}
                      onSelectEmail={handleSelectEmail}
                      onDeleteSelected={handleDeleteSelected}
                      onDeleteAll={handleDeleteAll}
                      selectedCount={getSelectedCount()}
                    />
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
                      value={(emailStats.spam / Math.max(1, emailStats.total)) * 100} 
                      className="h-1.5 bg-red-200 dark:bg-red-950/50"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm text-foreground/70">Promotions Detected</h4>
                      <span className="font-medium">{emailStats.promotional.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(emailStats.promotional / Math.max(1, emailStats.total)) * 100} 
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
