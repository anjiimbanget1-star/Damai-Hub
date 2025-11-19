export enum ReportType {
  THREAT = 'THREAT',
  PEACE = 'PEACE'
}

export enum ThreatLevel {
  LOW = 'Rendah',
  MEDIUM = 'Sedang',
  HIGH = 'Bahaya Fisik'
}

export enum ReportStatus {
  PENDING = 'Pending Review',
  VERIFYING = 'Verifikasi Lapangan',
  APPROVED = 'Terverifikasi',
  REJECTED = 'Ditolak'
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  location: string;
  timestamp: number;
  status: ReportStatus;
  // Threat specific
  threatLevel?: ThreatLevel;
  ticketCode?: string; // For anonymous users
  isRedacted?: boolean;
  // Peace specific
  organizer?: string;
  impactCount?: number;
  tags?: string[];
  imageUrl?: string;
}

export interface AnalysisResult {
  isSafe: boolean;
  suggestedCategory: string;
  sentimentScore: number;
  summary: string;
}