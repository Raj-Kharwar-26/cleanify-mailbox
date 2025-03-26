
import { useState } from "react";
import { EmailData } from "@/utils/EmailService";
import { Check, Trash2, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface EmailListProps {
  emails: EmailData[];
  category: 'spam' | 'promotional';
  isLoading: boolean;
  onSelectEmail: (id: string, selected: boolean) => void;
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
  selectedCount: number;
}

const EmailList = ({
  emails,
  category,
  isLoading,
  onSelectEmail,
  onDeleteSelected,
  onDeleteAll,
  selectedCount
}: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="w-10 h-10 border-t-4 border-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-foreground/70">Loading emails...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="bg-secondary/50 rounded-lg p-6 text-center my-4">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h4 className="font-medium text-lg mb-2">No {category === 'spam' ? 'Spam' : 'Promotional'} Emails</h4>
        <p className="text-foreground/70">
          Your inbox is clean and free of {category} emails.
        </p>
      </div>
    );
  }

  const bgColor = category === 'spam' 
    ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30' 
    : 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-foreground/70">
          {selectedCount > 0 ? (
            <span>{selectedCount} selected</span>
          ) : (
            <span>{emails.length} emails</span>
          )}
        </div>
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDeleteSelected}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
            </Button>
          )}
          <Button 
            variant={category === 'spam' ? "destructive" : "default"}
            size="sm"
            onClick={onDeleteAll}
            className={category === 'promotional' ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete All
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {emails.map((email) => (
          <div 
            key={email.id} 
            className={`${bgColor} rounded-lg p-4 flex items-start gap-3 transition-all hover:shadow-md cursor-pointer`}
          >
            <Checkbox
              id={`check-${email.id}`}
              checked={email.selected}
              onCheckedChange={(checked) => onSelectEmail(email.id, checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium mb-1 break-words">{email.subject}</h4>
              <p className="text-sm text-foreground/70 mb-2">{email.from}</p>
              <p className="text-sm text-foreground/80 line-clamp-2">{email.snippet}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-foreground/60">
                  {new Date(email.date).toLocaleDateString()}
                </span>
                <div className="flex items-center">
                  {category === 'spam' ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Mail className="h-4 w-4 text-orange-500 mr-1" />
                  )}
                  <span className="text-xs capitalize">{category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;
