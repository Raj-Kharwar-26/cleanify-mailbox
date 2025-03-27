
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

const GoogleOAuthInstructions: React.FC = () => {
  const currentUrl = window.location.origin;
  const redirectUrl = `${currentUrl}/auth/callback`;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-red-500">Troubleshooting OAuth Errors</CardTitle>
        <CardDescription>
          Follow these steps to fix the "redirect_uri_mismatch" error
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-md">
          <h3 className="font-semibold mb-2">The error occurs because:</h3>
          <p>The redirect URL in your Google API Console doesn't match the one your application is using.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">To fix this error:</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center" target="_blank" rel="noopener noreferrer">Google Cloud Console<ExternalLink className="ml-1 h-3 w-3" /></a></li>
            <li>Select the project you're using for this application</li>
            <li>Go to "Credentials" in the left sidebar</li>
            <li>Edit the OAuth 2.0 Client ID you're using</li>
            <li>Under "Authorized redirect URIs", add the following URL:
              <div className="bg-secondary/80 p-2 rounded mt-1 font-mono text-sm break-all">
                {redirectUrl}
              </div>
            </li>
            <li>Click "Save" and wait a few minutes for changes to propagate</li>
            <li>Try connecting your Gmail account again</li>
          </ol>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-md mt-4">
          <h3 className="font-semibold mb-2">Additional Information:</h3>
          <p>The exact redirect URI your application is using is:</p>
          <div className="bg-secondary/80 p-2 rounded mt-1 font-mono text-sm break-all">
            {redirectUrl}
          </div>
          <p className="mt-2">This must be added exactly as shown to your Google OAuth Client configuration.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleOAuthInstructions;
