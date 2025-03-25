
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GoogleConfigGuide = () => {
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
        
        <h3 className="font-semibold text-lg">5. Add Client ID to your app</h3>
        <p>Create a <code>.env.local</code> file in your project root with:</p>
        <div className="bg-muted p-3 rounded-md font-mono text-sm my-2 relative group">
          <code>
            VITE_GOOGLE_CLIENT_ID=your_client_id_here<br />
            VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
          </code>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard("VITE_GOOGLE_CLIENT_ID=your_client_id_here\nVITE_GOOGLE_CLIENT_SECRET=your_client_secret_here")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Note: Make sure to add .env.local to your .gitignore file to keep your credentials secure.</p>
        
        <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mt-4">
          <h4 className="font-semibold text-primary mb-2">Using your credentials</h4>
          <p className="mb-2">Replace the placeholders with your actual credentials:</p>
          <div className="bg-muted p-3 rounded-md font-mono text-sm my-2 relative group">
            <code>
              VITE_GOOGLE_CLIENT_ID=1062456274487-1no3a0ddd06vl0eiggcmdb0v9t7rstim.apps.googleusercontent.com<br />
              VITE_GOOGLE_CLIENT_SECRET=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
            </code>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard("VITE_GOOGLE_CLIENT_ID=1062456274487-1no3a0ddd06vl0eiggcmdb0v9t7rstim.apps.googleusercontent.com\nVITE_GOOGLE_CLIENT_SECRET=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")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mt-2"><AlertCircle className="inline-block h-4 w-4 mr-1" /> Keep your Client Secret secure. Never commit it to public repositories.</p>
        </div>
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
