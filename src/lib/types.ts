export type Client = {
  srNo: number;
  clientName: string;
  email: string;
  mobile: string;
  reference: string;
  incomeSource: string;
  contactId: string;
  campaignSent: string | null;
  replied: string | null;
  autoReplySent: string | null;
  formSubmitted: string | null;
  invoiceId: string;
  invoiceCreated: string | null;
  invoiceAmount: number | null;
  fu1Sent: string | null;
  fu2Sent: string | null;
  fu3Sent: string | null;
  lastFollowUpDate: string | null;
  paymentReceived: string | null;
  onboardingFormSent: string | null;
  onboardingFormSubmitted: string | null;
  status: string;
  notes: string;
  oneDriveFolderId: string;
  oneDriveFileId: string;
  oneDriveFolderUrl: string;
  oneDriveFileUrl: string;
};

export type ClientStatus =
  | 'Campaign Sent'
  | 'Replied - Awaiting Call'
  | 'Form Submitted'
  | 'Invoice Sent'
  | 'FU1 Sent'
  | 'FU2 Sent'
  | 'FU3 Sent'
  | 'Paid'
  | 'Onboarding Sent'
  | 'Onboarding Complete'
  | 'Lost - Manual Review';
