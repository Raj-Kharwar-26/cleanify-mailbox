import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleConfigGuideProps {
  clientId?: string;
  clientSecret?: string;
}

const GoogleConfigGuide: React.FC<GoogleConfigGuideProps> = ({ clientId, clientSecret }) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard"
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Setting Up Google Client ID</CardTitle>
        <CardDescription>
          Follow these steps to enable Gmail integration in CleanMail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">1. Create a Google Cloud Project</h3>
        <p>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a> and create a new project.</p>
        
        <h3 className="font-semibold text-lg">2. Enable the Gmail API</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>In your project, navigate to "APIs &amp; Services" &gt; "Library"</li>
          <li>Search for "Gmail API" and enable it</li>
        </ol>
        
        <h3 className="font-semibold text-lg">3. Configure OAuth Consent Screen</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to "APIs &amp; Services" &gt; "OAuth consent screen"</li>
          <li>Configure the consent screen (User Type: External)</li>
          <li>Add scopes for Gmail API (https://www.googleapis.com/auth/gmail.modify)</li>
          <li>Add test users if in testing mode</li>
        </ol>
        
        <h3 className="font-semibold text-lg">4. Create OAuth 2.0 Credentials</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to "APIs &amp; Services" &gt; "Credentials"</li>
          <li>Click "Create Credentials" &gt; "OAuth client ID"</li>
          <li>Set Application type to "Web application"</li>
          <li>Add authorized JavaScript origins: 
            <div className="bg-muted p-2 rounded-md font-mono text-sm my-2 flex justify-between items-center">
              <code>http://localhost:8080</code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard("http://localhost:8080")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </li>
          <li>Add authorized redirect URIs: 
            <div className="bg-muted p-2 rounded-md font-mono text-sm my-2 flex justify-between items-center">
              <code>http://localhost:8080/auth/callback</code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard("http://localhost:8080/auth/callback")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </li>
        </ol>
        
        <Separator className="my-4" />
        
        <h3 className="font-semibold text-lg">5. Credentials Status</h3>
        {clientId && clientSecret ? (
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-md border border-green-200 dark:border-green-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-green-500" />
              <h4 className="font-semibold text-green-700 dark:text-green-300">Credentials Successfully Configured</h4>
            </div>
            <p className="mb-4">Your Google API credentials have been set up successfully. You can now connect your Gmail account.</p>
            
            <h5 className="font-medium text-sm mb-1">Your Client ID:</h5>
            <div className="bg-muted p-2 rounded-md font-mono text-sm mb-3 flex justify-between items-center">
              <code className="text-xs break-all">{clientId}</code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(clientId)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <h5 className="font-medium text-sm mb-1">Your Client Secret:</h5>
            <div className="bg-muted p-2 rounded-md font-mono text-sm mb-2 flex justify-between items-center">
              <code className="text-xs break-all">{clientSecret}</code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(clientSecret)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
              <AlertCircle className="h-3 w-3" /> Keep your Client Secret secure. Never commit it to public repositories.
            </p>
          </div>
        ) : (
          <p className="bg-muted p-3 rounded-md font-mono text-sm my-2 relative group">
            Credentials not found. Please set up your Google API credentials.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          For detailed instructions, refer to the <a href="https://developers.google.com/gmail/api/quickstart/js" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gmail API Quickstart Guide</a>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default GoogleConfigGuide;
