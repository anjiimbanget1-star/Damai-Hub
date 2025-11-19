import { Report, ReportStatus, ReportType, ThreatLevel } from "./types";

export const MOCK_REPORTS: Report[] = [
  {
    id: 'r1',
    type: ReportType.THREAT,
    title: 'Dugaan Intoleransi Sekolah',
    description: 'Ada pelarangan kegiatan ibadah siswa minoritas di area sekolah X.',
    location: 'Bandung, Jawa Barat',
    timestamp: Date.now() - 86400000,
    status: ReportStatus.VERIFYING,
    threatLevel: ThreatLevel.MEDIUM,
    isRedacted: true
  },
  {
    id: 'r2',
    type: ReportType.PEACE,
    title: 'Festival Kuliner Lintas Iman',
    description: 'Mengumpulkan 500 pemuda dari berbagai latar belakang untuk memasak bersama.',
    location: 'Yogyakarta',
    timestamp: Date.now() - 172800000,
    status: ReportStatus.APPROVED,
    organizer: 'Pemuda Damai Jogja',
    impactCount: 500,
    tags: ['Budaya', 'Kuliner', 'Dialog'],
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: 'r3',
    type: ReportType.PEACE,
    title: 'Gotong Royong Bersih Sungai',
    description: 'Warga desa A dan B yang sempat konflik kini bekerja sama membersihkan sungai.',
    location: 'Poso, Sulawesi Tengah',
    timestamp: Date.now() - 40000000,
    status: ReportStatus.APPROVED,
    organizer: 'Desa Bersatu',
    impactCount: 200,
    tags: ['Lingkungan', 'Rekonsiliasi'],
    imageUrl: 'https://picsum.photos/800/401'
  }
];