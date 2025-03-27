export interface EmailData {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  date: string;
  category: 'spam' | 'promotional' | 'important';
  selected?: boolean;
}

export interface EmailStats {
  total: number;
  spam: number;
  promotional: number;
  unread: number;
  storage: number;
}

export interface DeletedEmail {
  id: string;
  category: 'spam' | 'promotional' | 'important';
  timestamp: number;
}

export class EmailService {
  private static tokenKey = 'gmail_token';
  private static clientIdKey = 'gmail_client_id';
  private static deletedEmailsKey = 'recently_deleted_emails';
  private static undoTimeWindow = 10000; // 10 seconds for undo window

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
      // Get the exact URL that the app is running on
      const origin = window.location.origin;
      const redirectUri = `${origin}/auth/callback`;
      
      console.log('Using redirect URI:', redirectUri);
      
      if (!clientId) {
        console.error('No client ID found in localStorage');
        return '';
      }
      
      // Manually construct the OAuth URL with more detailed scope for Gmail
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
      console.log('Stored token for Gmail API access');
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
    if (this.isAuthenticated()) {
      try {
        // In a real implementation, we would fetch real stats from Gmail API
        // For now we return mock data
        const spamEmails = await this.getSpamEmails(100);
        const promoEmails = await this.getPromotionalEmails(100);
        
        return {
          total: 1250,
          spam: spamEmails.length,
          promotional: promoEmails.length,
          unread: 15,
          storage: 8 // 8% of quota used
        };
      } catch (error) {
        console.error('Error fetching email stats:', error);
        return null;
      }
    }
    
    // Return mock stats for testing
    return {
      total: 1250,
      spam: 42,
      promotional: 378,
      unread: 15,
      storage: 8
    };
  }

  static async getSpamEmails(maxResults = 100): Promise<EmailData[]> {
    if (this.isAuthenticated()) {
      try {
        // In a real implementation, we would fetch real data from Gmail API
        // using category:spam query param
        console.log(`Fetching up to ${maxResults} spam emails`);
        
        // For now return mock data
        return this.getMockEmails('spam', maxResults);
      } catch (error) {
        console.error('Error fetching spam emails:', error);
        return [];
      }
    }
    
    // Return mock data when not authenticated
    return this.getMockEmails('spam', maxResults);
  }

  static async getPromotionalEmails(maxResults = 100): Promise<EmailData[]> {
    if (this.isAuthenticated()) {
      try {
        // In a real implementation, we would fetch real data from Gmail API
        // using category:promotions query param
        console.log(`Fetching up to ${maxResults} promotional emails`);
        
        // For now return mock data
        return this.getMockEmails('promotional', maxResults);
      } catch (error) {
        console.error('Error fetching promotional emails:', error);
        return [];
      }
    }
    
    // Return mock data when not authenticated
    return this.getMockEmails('promotional', maxResults);
  }

  static async deleteEmails(ids: string[], category: 'spam' | 'promotional' = 'spam'): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.log('Not authenticated, cannot delete emails');
      return false;
    }
    
    try {
      console.log(`Deleting ${ids.length} emails from ${category} category`);
      
      // Store recently deleted emails for potential undo
      const deletedEmails: DeletedEmail[] = ids.map(id => ({
        id,
        category,
        timestamp: Date.now()
      }));
      
      this.addToRecentlyDeletedEmails(deletedEmails);
      
      // In a real implementation, we would call the Gmail API to trash these emails
      // For now just pretend it worked
      return true;
    } catch (error) {
      console.error('Error deleting emails:', error);
      return false;
    }
  }
  
  static async undoRecentDeletion(): Promise<{ success: boolean; count: number }> {
    try {
      const recentlyDeleted = this.getRecentlyDeletedEmails();
      
      if (recentlyDeleted.length === 0) {
        return { success: false, count: 0 };
      }
      
      // Filter to only emails deleted within our time window
      const currentTime = Date.now();
      const eligibleForUndo = recentlyDeleted.filter(
        email => currentTime - email.timestamp < this.undoTimeWindow
      );
      
      if (eligibleForUndo.length === 0) {
        return { success: false, count: 0 };
      }
      
      // In a real implementation, we would call the Gmail API to restore these emails
      console.log(`Undoing deletion of ${eligibleForUndo.length} emails`);
      
      // Remove these from our recently deleted list
      this.removeFromRecentlyDeletedEmails(eligibleForUndo.map(e => e.id));
      
      return { success: true, count: eligibleForUndo.length };
    } catch (error) {
      console.error('Error undoing recent deletion:', error);
      return { success: false, count: 0 };
    }
  }
  
  private static getRecentlyDeletedEmails(): DeletedEmail[] {
    try {
      const storedData = localStorage.getItem(this.deletedEmailsKey);
      if (!storedData) return [];
      
      return JSON.parse(storedData) as DeletedEmail[];
    } catch (error) {
      console.error('Error getting recently deleted emails:', error);
      return [];
    }
  }
  
  private static addToRecentlyDeletedEmails(newEmails: DeletedEmail[]): void {
    try {
      const existing = this.getRecentlyDeletedEmails();
      const updated = [...existing, ...newEmails];
      
      // Only keep the most recent deletions to avoid localStorage growing too large
      const maxToKeep = 100;
      const trimmed = updated.slice(-maxToKeep);
      
      localStorage.setItem(this.deletedEmailsKey, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error adding to recently deleted emails:', error);
    }
  }
  
  private static removeFromRecentlyDeletedEmails(ids: string[]): void {
    try {
      const existing = this.getRecentlyDeletedEmails();
      const updated = existing.filter(email => !ids.includes(email.id));
      
      localStorage.setItem(this.deletedEmailsKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing from recently deleted emails:', error);
    }
  }

  private static getMockEmails(
    category: 'spam' | 'promotional' | 'important',
    count = 20
  ): EmailData[] {
    const result: EmailData[] = [];
    
    // Mock subjects and senders based on category
    const mockData = {
      spam: {
        subjects: [
          "You've WON a FREE iPhone 15 Pro!!!",
          "URGENT: Your Account Needs Verification",
          "Make $5000 Daily From Home - Guaranteed!",
          "Congratulations! You're our lucky winner",
          "Unlock Your Secret Admirer - Click Now",
          "Your Payment of $499.99 is Due",
          "ALERT: Unusual activity on your account",
          "Increase Size by 3x with this Secret Pill",
          "Limited Time Offer: Rolex watches 90% OFF",
          "Your Email Will Be Deleted in 24hrs"
        ],
        senders: [
          "prizes@winbig-now.com",
          "secure-verify@bank-alerts.net",
          "wealth@easy-money.biz",
          "notification@amaz0n-delivery.net",
          "support@account-security-alert.com",
          "team@lotterywinners.org",
          "admin@verify-your-account-now.com",
          "noreply@special-offers-today.net",
          "service@paypaI-security.com",
          "contact@investment-opportunity.biz"
        ]
      },
      promotional: {
        subjects: [
          "FLASH SALE: 70% OFF EVERYTHING!",
          "Limited Time Offer - Act Now!",
          "New arrivals just for you",
          "Your Exclusive Discount Code Inside",
          "Weekend Sale: Additional 20% OFF",
          "We miss you! Here's 15% OFF your next order",
          "Introducing our NEW Summer Collection",
          "Members Only: Early Access to Black Friday Deals",
          "BOGO Free - Today Only!",
          "Your Cart Is Waiting - Complete Your Purchase"
        ],
        senders: [
          "deals@fashion-store.com",
          "newsletter@tech-gadgets.com",
          "updates@footwear-brand.com",
          "marketing@beauty-products.com",
          "offers@furniture-deals.com",
          "news@online-bookstore.com",
          "info@travel-discounts.com",
          "promotions@fitness-equipment.com",
          "hello@food-delivery.com",
          "specials@electronics-store.com"
        ]
      },
      important: {
        subjects: [
          "Meeting Agenda for Tomorrow",
          "Your Flight Confirmation",
          "Invoice #12345 Due Soon",
          "Project Update: Phase 2 Complete",
          "Important: Health Insurance Renewal",
          "Your Tax Return Documents",
          "Quarterly Performance Review",
          "Contract Ready for Signature",
          "Security Alert: Password Change Required",
          "Job Application Status Update"
        ],
        senders: [
          "manager@company.com",
          "reservations@airline.com",
          "billing@service-provider.com",
          "team@project-management.com",
          "benefits@healthcare.org",
          "tax@accounting-firm.com",
          "hr@company.com",
          "contracts@legal-team.com",
          "security@online-service.com",
          "careers@hiring-company.com"
        ]
      }
    };
    
    const categoryData = mockData[category];
    
    for (let i = 0; i < count; i++) {
      const subjectIndex = i % categoryData.subjects.length;
      const senderIndex = i % categoryData.senders.length;
      
      result.push({
        id: `email-${category}-${i}`,
        threadId: `thread-${category}-${i}`,
        subject: categoryData.subjects[subjectIndex],
        snippet: `This is a mock ${category} email snippet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        from: categoryData.senders[senderIndex],
        date: new Date(Date.now() - i * 3600000 * 24).toISOString(),
        category,
        selected: false
      });
    }
    
    return result;
  }
}
