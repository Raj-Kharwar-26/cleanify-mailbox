
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGmailAuth } from '@/hooks/use-gmail-auth';

const ClientIdSetup: React.FC = () => {
  const { clientId, setGmailClientId } = useGmailAuth();
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
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Client ID</Button>
      </CardFooter>
    </Card>
  );
};

export default ClientIdSetup;
