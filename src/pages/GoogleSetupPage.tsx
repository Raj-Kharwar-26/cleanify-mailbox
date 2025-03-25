
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from "@/components/DashboardHeader";
import GoogleConfigGuide from "@/utils/GoogleConfigGuide";
import ClientIdSetup from '@/components/ClientIdSetup';
import { useGmailAuth } from '@/hooks/use-gmail-auth';
import { Button } from "@/components/ui/button";

const GoogleSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useGmailAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="container-custom max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Google API Setup</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          <ClientIdSetup />

          <GoogleConfigGuide clientId={clientId || undefined} />
        </div>
      </main>
    </div>
  );
};

export default GoogleSetupPage;
