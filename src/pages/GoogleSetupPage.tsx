
import React from 'react';
import Navbar from "@/components/Navbar";
import GoogleConfigGuide from "@/utils/GoogleConfigGuide";

const GoogleSetupPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Gmail Integration Setup</h1>
        <p className="text-lg text-muted-foreground mb-8">
          To enable Gmail integration in CleanMail and fetch your emails, you need to set up a Google Client ID. 
          Follow the guide below to get started.
        </p>
        <GoogleConfigGuide />
      </main>
    </div>
  );
};

export default GoogleSetupPage;
