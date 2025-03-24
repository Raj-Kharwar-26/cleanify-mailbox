
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailService } from '@/utils/EmailService';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setError(error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to authenticate with Google.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code provided');
        toast({
          title: 'Authentication Error',
          description: 'No authorization code was provided.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      try {
        const success = await EmailService.handleAuthCallback(code);
        if (success) {
          toast({
            title: 'Authentication Successful',
            description: 'You have successfully connected your Gmail account.',
          });
          navigate('/dashboard');
        } else {
          setError('Failed to exchange authorization code for tokens');
          toast({
            title: 'Authentication Error',
            description: 'Failed to exchange the authorization code for tokens.',
            variant: 'destructive',
          });
          setTimeout(() => navigate('/dashboard'), 3000);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
            <p className="mb-4">{error}</p>
            <p>Redirecting back to dashboard...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium">Completing authentication...</h2>
            <p className="text-foreground/70 mt-2">Please wait while we connect your email account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
