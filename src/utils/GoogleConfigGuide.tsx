
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const GoogleConfigGuide = () => {
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
          <li>In your project, navigate to "APIs & Services" > "Library"</li>
          <li>Search for "Gmail API" and enable it</li>
        </ol>
        
        <h3 className="font-semibold text-lg">3. Configure OAuth Consent Screen</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to "APIs & Services" > "OAuth consent screen"</li>
          <li>Configure the consent screen (User Type: External)</li>
          <li>Add scopes for Gmail API (https://www.googleapis.com/auth/gmail.modify)</li>
          <li>Add test users if in testing mode</li>
        </ol>
        
        <h3 className="font-semibold text-lg">4. Create OAuth 2.0 Credentials</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to "APIs & Services" > "Credentials"</li>
          <li>Click "Create Credentials" > "OAuth client ID"</li>
          <li>Set Application type to "Web application"</li>
          <li>Add authorized JavaScript origins (your app URL)</li>
          <li>Add authorized redirect URIs (e.g., https://your-app.com/auth/callback)</li>
        </ol>
        
        <Separator className="my-4" />
        
        <h3 className="font-semibold text-lg">5. Add Client ID to your app</h3>
        <p>Create a <code>.env</code> file in your project root with:</p>
        <div className="bg-muted p-3 rounded-md font-mono text-sm my-2">
          VITE_GOOGLE_CLIENT_ID=your_client_id_here<br />
          VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
        </div>
        <p className="text-sm text-muted-foreground mt-2">Note: Make sure to add .env to your .gitignore file to keep your credentials secure.</p>
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
