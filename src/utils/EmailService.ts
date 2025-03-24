
import { google } from 'googleapis';

export interface EmailData {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  date: string;
  category: 'spam' | 'promotional' | 'important';
}

export interface EmailStats {
  total: number;
  spam: number;
  promotional: number;
  unread: number;
  storage: number;
}

export class EmailService {
  private static tokenKey = 'gmail_token';
  private static gmail = google.gmail('v1');

  static getAuthUrl(): string {
    try {
      const oauth2Client = new google.auth.OAuth2(
        import.meta.env.VITE_GOOGLE_CLIENT_ID,
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        window.location.origin + '/auth/callback'
      );

      return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.modify'],
        prompt: 'consent',
      });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      return '';
    }
  }

  static async handleAuthCallback(code: string): Promise<boolean> {
    try {
      const oauth2Client = new google.auth.OAuth2(
        import.meta.env.VITE_GOOGLE_CLIENT_ID,
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        window.location.origin + '/auth/callback'
      );

      const { tokens } = await oauth2Client.getToken(code);
      localStorage.setItem(this.tokenKey, JSON.stringify(tokens));
      return true;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return false;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  static async getEmailStats(): Promise<EmailStats | null> {
    try {
      const oauth2Client = this.getAuthClient();
      if (!oauth2Client) return null;

      // Wrap API calls in try-catch to handle potential browser compatibility issues
      let profile;
      try {
        // Get profile for storage info
        profile = await this.gmail.users.getProfile({
          auth: oauth2Client,
          userId: 'me',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        profile = { data: { messagesTotal: '1000' } }; // Fallback value
      }
      
      let totalRes;
      try {
        // Get messages count
        totalRes = await this.gmail.users.messages.list({
          auth: oauth2Client,
          userId: 'me',
          maxResults: 1,
        });
      } catch (err) {
        console.error('Error fetching total messages:', err);
        totalRes = { data: { resultSizeEstimate: 0 } }; // Fallback value
      }
      
      let spamRes;
      try {
        // Get spam count
        spamRes = await this.gmail.users.messages.list({
          auth: oauth2Client,
          userId: 'me',
          q: 'in:spam',
          maxResults: 500,
        });
      } catch (err) {
        console.error('Error fetching spam messages:', err);
        spamRes = { data: { messages: [] } }; // Fallback value
      }
      
      let promotionalRes;
      try {
        // Get promotional
        promotionalRes = await this.gmail.users.messages.list({
          auth: oauth2Client,
          userId: 'me',
          q: 'category:promotions',
          maxResults: 500,
        });
      } catch (err) {
        console.error('Error fetching promotional messages:', err);
        promotionalRes = { data: { messages: [] } }; // Fallback value
      }
      
      let unreadRes;
      try {
        // Get unread
        unreadRes = await this.gmail.users.messages.list({
          auth: oauth2Client,
          userId: 'me',
          q: 'is:unread',
          maxResults: 500,
        });
      } catch (err) {
        console.error('Error fetching unread messages:', err);
        unreadRes = { data: { messages: [] } }; // Fallback value
      }
      
      // Calculate storage percentage using a simpler method
      // Default to 10% if we can't get actual data
      let storagePercent = 10;
      
      // Try to use the data we have to estimate storage usage
      if (profile?.data && typeof profile.data.messagesTotal === 'string') {
        // Rough estimation based on message count (very approximate)
        // Assume average email size of 75KB
        const quotaInBytes = 15 * 1024 * 1024 * 1024; // 15GB in bytes
        const estimatedUsage = Number(profile.data.messagesTotal) * 75 * 1024;
        storagePercent = Math.floor((estimatedUsage / quotaInBytes) * 100);
      }
      
      // Make sure percentage is between 0-100
      storagePercent = Math.max(0, Math.min(100, storagePercent));
      
      return {
        total: Number(totalRes?.data?.resultSizeEstimate) || 0,
        spam: (spamRes?.data?.messages?.length || 0),
        promotional: (promotionalRes?.data?.messages?.length || 0),
        unread: (unreadRes?.data?.messages?.length || 0),
        storage: storagePercent
      };
    } catch (error) {
      console.error('Error fetching email stats:', error);
      return null;
    }
  }

  static async getSpamEmails(maxResults = 20): Promise<EmailData[]> {
    return this.getEmailsByCategory('in:spam', 'spam', maxResults);
  }

  static async getPromotionalEmails(maxResults = 20): Promise<EmailData[]> {
    return this.getEmailsByCategory('category:promotions', 'promotional', maxResults);
  }

  static async deleteEmails(ids: string[]): Promise<boolean> {
    try {
      const oauth2Client = this.getAuthClient();
      if (!oauth2Client) return false;

      for (const id of ids) {
        await this.gmail.users.messages.trash({
          auth: oauth2Client,
          userId: 'me',
          id,
        });
      }
      return true;
    } catch (error) {
      console.error('Error deleting emails:', error);
      return false;
    }
  }

  private static getAuthClient() {
    const tokenStr = localStorage.getItem(this.tokenKey);
    if (!tokenStr) return null;

    try {
      const tokens = JSON.parse(tokenStr);
      const oauth2Client = new google.auth.OAuth2(
        import.meta.env.VITE_GOOGLE_CLIENT_ID,
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        window.location.origin + '/auth/callback'
      );
      oauth2Client.setCredentials(tokens);
      return oauth2Client;
    } catch (error) {
      console.error('Error setting up auth client:', error);
      return null;
    }
  }

  private static async getEmailsByCategory(
    query: string,
    category: 'spam' | 'promotional' | 'important',
    maxResults = 20
  ): Promise<EmailData[]> {
    try {
      const oauth2Client = this.getAuthClient();
      if (!oauth2Client) return [];

      const res = await this.gmail.users.messages.list({
        auth: oauth2Client,
        userId: 'me',
        q: query,
        maxResults,
      });

      if (!res.data.messages || res.data.messages.length === 0) {
        return [];
      }

      const emails: EmailData[] = [];
      
      for (const message of res.data.messages) {
        try {
          const msgDetail = await this.gmail.users.messages.get({
            auth: oauth2Client,
            userId: 'me',
            id: message.id as string,
          });

          const headers = msgDetail.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
          const from = headers.find(h => h.name === 'From')?.value || '';
          const date = headers.find(h => h.name === 'Date')?.value || '';

          emails.push({
            id: message.id as string,
            threadId: message.threadId as string,
            subject,
            snippet: msgDetail.data.snippet || '',
            from,
            date,
            category,
          });
        } catch (error) {
          console.error(`Error fetching details for message ${message.id}:`, error);
          // Continue with next message
        }
      }

      return emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }
}
