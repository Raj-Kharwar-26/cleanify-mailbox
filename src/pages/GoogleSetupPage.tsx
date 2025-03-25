
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import GoogleConfigGuide from "@/utils/GoogleConfigGuide";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GoogleSetupPage = () => {
  // Hard-code the client ID since we've received it directly
  const clientId = "1062456274487-1no3a0ddd06vl0eiggcmdb0v9t7rstim.apps.googleusercontent.com";
  const clientSecret = "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";
  const [credentialsSet, setCredentialsSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Store credentials in localStorage for the EmailService to use
    localStorage.setItem('gmail_client_id', clientId);
    localStorage.setItem('gmail_client_secret', clientSecret);
    setCredentialsSet(true);
    
    // Show a toast to indicate credentials are set
    toast({
      title: "Google API Credentials Set",
      description: "Your Gmail API credentials have been configured successfully.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Gmail Integration Setup</h1>
        <p className="text-lg text-muted-foreground mb-8">
          To enable Gmail integration in CleanMail and fetch your emails, you need to set up a Google Client ID. 
          Follow the guide below to get started.
        </p>
        
        {credentialsSet ? (
          <Alert className="mb-8 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Google Client ID is configured! You can now use Gmail integration features.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Setting up Google Client ID...
            </AlertDescription>
          </Alert>
        )}
        
        <GoogleConfigGuide clientId={clientId} clientSecret={clientSecret} />
      </main>
    </div>
  );
};

export default GoogleSetupPage;
