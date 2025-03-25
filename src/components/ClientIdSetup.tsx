
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGmailAuth } from '@/hooks/use-gmail-auth';
import { InfoCircle } from 'lucide-react';

const ClientIdSetup: React.FC = () => {
  const { clientId, setGmailClientId, isEnvClientId } = useGmailAuth();
  const [newClientId, setNewClientId] = useState(clientId || '');

  const handleSave = () => {
    if (newClientId.trim()) {
      setGmailClientId(newClientId.trim());
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Set Google API Client ID</CardTitle>
        <CardDescription>
          Enter your Google API Client ID to enable Gmail integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEnvClientId ? (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-center gap-2 mb-2">
                <InfoCircle className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Using Environment Variable</h4>
              </div>
              <p>Your Google Client ID is being loaded from the environment variable <code>VITE_GOOGLE_CLIENT_ID</code>.</p>
              <p className="mt-2 text-sm">Value: <code>{clientId}</code></p>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                placeholder="Enter your Google API Client ID"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Paste the client ID from your Google Cloud Console OAuth credentials
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isEnvClientId && (
          <Button onClick={handleSave}>Save Client ID</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClientIdSetup;
