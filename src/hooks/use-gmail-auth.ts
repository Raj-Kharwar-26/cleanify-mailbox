
import { useState, useEffect, useCallback } from 'react';
import { EmailService } from '@/utils/EmailService';
import { useToast } from '@/hooks/use-toast';

export const useGmailAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isEnvClientId, setIsEnvClientId] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    const authenticated = EmailService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    // Check for client ID
    const storedClientId = EmailService.getClientId();
    setClientId(storedClientId);
    
    // Check if client ID is from environment variable
    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setIsEnvClientId(!!envClientId && envClientId !== 'your_client_id_here' && envClientId === storedClientId);
  }, []);

  const handleGmailConnect = useCallback(() => {
    const storedClientId = EmailService.getClientId();
    
    if (!storedClientId) {
      toast({
        title: "Client ID Missing",
        description: "Please set up your Google API credentials first in the Google Setup page.",
        variant: "destructive",
      });
      return;
    }
    
    const authUrl = EmailService.getAuthUrl();
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      toast({
        title: "Authentication Error",
        description: "Failed to generate authentication URL. Please check your Google API credentials.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const setGmailClientId = useCallback((newClientId: string) => {
    if (newClientId) {
      EmailService.setClientId(newClientId);
      setClientId(newClientId);
      toast({
        title: "Client ID Saved",
        description: "Your Google API client ID has been saved successfully.",
      });
    }
  }, [toast]);

  return {
    isAuthenticated,
    clientId,
    isEnvClientId,
    handleGmailConnect,
    setGmailClientId
  };
};
