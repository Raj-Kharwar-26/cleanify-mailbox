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
  private static clientIdKey = 'gmail_client_id';

  static setClientId(clientId: string): void {
    localStorage.setItem(this.clientIdKey, clientId);
    console.log('Client ID stored:', clientId);
  }

  static getClientId(): string | null {
    // First try to get from environment variable
    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // If env var has a value and it's not the placeholder, use it
    if (envClientId && envClientId !== 'your_client_id_here') {
      return envClientId;
    }
    
    // Otherwise fall back to localStorage
    return localStorage.getItem(this.clientIdKey);
  }

  static getAuthUrl(): string {
    try {
      const clientId = this.getClientId();
      const redirectUri = window.location.origin + '/auth/callback';
      
      if (!clientId) {
        console.error('No client ID found in localStorage');
        return '';
      }
      
      // Manually construct the OAuth URL
      const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.modify');
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      
      return url;
    } catch (error) {
      console.error('Error generating auth URL:', error);
      return '';
    }
  }

  static async handleAuthCallback(code: string): Promise<boolean> {
    try {
      // In a real app, we would exchange the code for tokens here
      // For now, we'll just simulate success and store a dummy token
      const dummyTokens = {
        access_token: 'dummy_access_token',
        refresh_token: 'dummy_refresh_token',
        expiry_date: Date.now() + 3600000 // 1 hour from now
      };
      
      localStorage.setItem(this.tokenKey, JSON.stringify(dummyTokens));
      console.log('Stored dummy tokens for demonstration');
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
    // Return mock stats for now
    return {
      total: 1250,
      spam: 42,
      promotional: 378,
      unread: 15,
      storage: 8 // 8% of quota used
    };
  }

  static async getSpamEmails(maxResults = 20): Promise<EmailData[]> {
    // Return mock spam emails
    return this.getMockEmails('spam', maxResults);
  }

  static async getPromotionalEmails(maxResults = 20): Promise<EmailData[]> {
    // Return mock promotional emails
    return this.getMockEmails('promotional', maxResults);
  }

  static async deleteEmails(ids: string[]): Promise<boolean> {
    console.log('Mock deleting emails with IDs:', ids);
    // Simulating successful deletion
    return true;
  }

  private static getMockEmails(
    category: 'spam' | 'promotional' | 'important',
    count = 20
  ): EmailData[] {
    const result: EmailData[] = [];
    
    for (let i = 0; i < count; i++) {
      result.push({
        id: `email-${category}-${i}`,
        threadId: `thread-${i}`,
        subject: `${category === 'spam' ? 'SPAM: ' : ''}Mock email subject #${i}`,
        snippet: `This is a mock ${category} email snippet for demonstration purposes...`,
        from: `sender-${i}@example.com`,
        date: new Date(Date.now() - i * 3600000).toISOString(),
        category,
      });
    }
    
    return result;
  }
}
