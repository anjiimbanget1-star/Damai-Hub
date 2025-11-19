import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QuickExit } from './components/QuickExit';
import { Report, ReportType, ReportStatus, ThreatLevel, AnalysisResult } from './types';
import { MOCK_REPORTS } from './constants';
import { analyzeReportContent } from './services/geminiService';
import { ImpactChart, ZoneStatusChart } from './components/DashboardCharts';
import { AlertTriangle, Heart, MapPin, Shield, Send, Lock, Eye, EyeOff, Search, CheckCircle, FileText, Activity } from 'lucide-react';

// --- SUB-COMPONENTS (Defined here to keep single file requirement manageable while clean) ---

// 1. LANDING PAGE
const LandingPage: React.FC<{ setPage: (p: string) => void, stats: any }> = ({ setPage, stats }) => (
  <div className="animate-fade-in">
    {/* Hero */}
    <section className="relative bg-trust overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Menjaga Ruang, <br className="hidden md:block" />
          <span className="text-teal-400">Merawat Damai.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-10">
          Platform terintegrasi untuk pelaporan dini potensi konflik dan penyebaran inisiatif perdamaian di seluruh Indonesia.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => setPage('report-threat')}
            className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-alert hover:bg-alert-dark md:py-4 md:text-xl transition-all shadow-lg hover:shadow-alert/50"
          >
            <AlertTriangle className="mr-2 h-6 w-6" />
            Lapor Potensi Ancaman
          </button>
          <button 
            onClick={() => setPage('report-peace')}
            className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-xl transition-all shadow-lg hover:shadow-teal-600/50"
          >
            <Heart className="mr-2 h-6 w-6" />
            Kabar Damai
          </button>
        </div>
      </div>
    </section>

    {/* Ticker */}
    <div className="bg-slate-900 border-b border-slate-800 py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee pl-full">
        <span className="text-teal-400 font-mono text-sm mx-4">● LIVE: 12 Zona Damai Baru Terdeteksi</span>
        <span className="text-slate-400 font-mono text-sm mx-4">|</span>
        <span className="text-teal-400 font-mono text-sm mx-4">● REPORT: Penanganan Kasus #T9928 Selesai</span>
        <span className="text-slate-400 font-mono text-sm mx-4">|</span>
        <span className="text-teal-400 font-mono text-sm mx-4">● EVENT: Festival Toleransi (Surabaya) - Besok</span>
      </div>
    </div>

    {/* Feature Grid */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Anonim & Terenkripsi</h3>
            <p className="text-slate-600 text-sm">Identitas pelapor ancaman dilindungi dengan enkripsi tingkat tinggi. Keamanan Anda adalah prioritas kami.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verifikasi Berlapis</h3>
            <p className="text-slate-600 text-sm">Setiap laporan diverifikasi oleh AI dan tim investigator profesional untuk menghindari hoaks.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Respon Cepat</h3>
            <p className="text-slate-600 text-sm">Sistem prioritas otomatis memastikan ancaman fisik mendapat penanganan segera oleh pihak berwenang.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// 2. REPORT THREAT FLOW
const ReportThreat: React.FC<{ onSubmit: (data: any) => void, isAnalyzing: boolean }> = ({ onSubmit, isAnalyzing }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', category: '', desc: '', location: '', evidence: null as File | null });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (formData.desc.length > 10) {
      // Simulate API call via App parent to manage async state better
      onSubmit({ ...formData, dryRun: true, onResult: setAnalysis });
    }
  };

  const finalSubmit = () => {
    onSubmit({ ...formData, analysis });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
        <div className="bg-alert p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center"><Shield className="mr-2" /> Jalur Whistleblower</h2>
            <p className="text-red-100 text-sm mt-1">Identitas Anda dirahasiakan. Enkripsi aktif.</p>
          </div>
          <Lock className="h-6 w-6 opacity-75" />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Ancaman</label>
                <select 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-alert focus:ring focus:ring-alert/20 py-2 px-3 border"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="intolerance">Intoleransi / Diskriminasi</option>
                  <option value="radicalism">Penyebaran Paham Radikal</option>
                  <option value="violence">Kekerasan Fisik / Persekusi</option>
                  <option value="hate_speech">Ujaran Kebencian Terorganisir</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi Kejadian</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Nama tempat / Kota (Radius disamarkan 500m)"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-alert focus:ring focus:ring-alert/20 py-2 px-3 border pl-10"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kronologi Detail</label>
                <textarea 
                  rows={5}
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-alert focus:ring focus:ring-alert/20 py-2 px-3 border"
                  placeholder="Ceritakan apa yang Anda lihat/dengar..."
                  value={formData.desc}
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  onBlur={handleAnalyze}
                ></textarea>
                {isAnalyzing && <p className="text-xs text-slate-500 mt-2 animate-pulse">Menganalisis konteks laporan...</p>}
                {analysis && (
                  <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                    <span className="font-semibold text-slate-700">AI Check:</span> 
                    <span className={analysis.sentimentScore > 70 ? "text-red-600 font-bold ml-2" : "text-slate-600 ml-2"}>
                      {analysis.suggestedCategory} (Risk Score: {analysis.sentimentScore}/100)
                    </span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.category || !formData.desc}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:bg-slate-300 transition-colors"
              >
                Lanjut ke Bukti
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                />
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 font-medium">
                  {formData.evidence ? formData.evidence.name : "Upload Foto/Video/Dokumen"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Metadata lokasi akan dihapus otomatis oleh sistem.</p>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50"
                >
                  Kembali
                </button>
                <button 
                  onClick={finalSubmit}
                  className="flex-1 bg-alert text-white py-3 rounded-lg font-bold hover:bg-alert-dark shadow-lg shadow-alert/30"
                >
                  Kirim Laporan Aman
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. REPORT PEACE FLOW
const ReportPeace: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', organizer: '', desc: '', tags: '', location: '' });

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-100">
        <div className="bg-teal-500 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center"><Heart className="mr-2" /> Kabar Damai</h2>
          <p className="text-teal-50 text-sm mt-1">Bagikan energi positif untuk menginspirasi Indonesia.</p>
        </div>
        <div className="p-8 space-y-5">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
              <input 
                type="text" 
                className="w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20 py-2 px-3 border"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Penyelenggara</label>
                <input 
                  type="text" 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20 py-2 px-3 border"
                  value={formData.organizer}
                  onChange={e => setFormData({...formData, organizer: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                <input 
                  type="text" 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20 py-2 px-3 border"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi & Dampak</label>
              <textarea 
                rows={4}
                className="w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20 py-2 px-3 border"
                placeholder="Ceritakan keseruan acara dan dampaknya..."
                value={formData.desc}
                onChange={e => setFormData({...formData, desc: e.target.value})}
              ></textarea>
            </div>
             <button 
                onClick={() => onSubmit(formData)}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/30"
              >
                Bagikan Cerita
            </button>
        </div>
      </div>
    </div>
  );
};

// 4. FEED & DASHBOARD
const Feed: React.FC<{ reports: Report[] }> = ({ reports }) => (
  <div className="max-w-5xl mx-auto py-8 px-4">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">Pantau Aktivitas</h2>
    <div className="grid gap-6">
      {reports.map(report => (
        <div key={report.id} className={`rounded-lg shadow-sm border overflow-hidden ${report.type === ReportType.THREAT ? 'border-l-4 border-l-alert bg-white' : 'border-l-4 border-l-teal-500 bg-white'}`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase tracking-wide mb-2 ${
                  report.type === ReportType.THREAT ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {report.type === ReportType.THREAT ? 'Alert Waspada' : 'Kabar Damai'}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mt-1">
                  <MapPin className="h-3 w-3 mr-1" /> {report.location}
                  <span className="mx-2">•</span>
                  {new Date(report.timestamp).toLocaleDateString()}
                </div>
              </div>
              {report.type === ReportType.THREAT && (
                <div className="text-right">
                   <span className="block text-xs text-slate-500 uppercase">Status</span>
                   <span className="font-bold text-alert">{report.status}</span>
                </div>
              )}
            </div>
            
            <p className="text-slate-700 mb-4 leading-relaxed">
              {report.isRedacted 
                ? <span className="italic text-slate-500 bg-slate-100 px-1 rounded">[Bagian disensor untuk keamanan korban]</span> 
                : null
              } {report.description}
            </p>

            {report.imageUrl && (
              <img src={report.imageUrl} alt="Activity" className="w-full h-64 object-cover rounded-lg mb-4" />
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {report.type === ReportType.THREAT ? (
                <div className="flex space-x-3">
                  <button className="text-sm font-medium text-slate-600 hover:text-alert flex items-center"><Eye className="h-4 w-4 mr-1"/> Pantau</button>
                  <button className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center"><Shield className="h-4 w-4 mr-1"/> Dukung Korban</button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button className="text-sm font-medium text-teal-600 hover:text-teal-700 font-bold">Join Next Event</button>
                  <button className="text-sm font-medium text-slate-600 hover:text-blue-600">Share</button>
                </div>
              )}
              {report.impactCount && (
                <span className="text-sm font-bold text-slate-500">{report.impactCount} Orang Terdampak</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CheckTicket: React.FC = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const check = () => {
    if(!code) return;
    // Mock check
    setStatus("Laporan Anda sedang dalam tahap Verifikasi Lapangan oleh tim Damai Hub.");
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Cek Status Laporan</h2>
      <p className="text-slate-500 mb-6">Masukkan Tiket Kriptografi yang Anda dapatkan saat melapor.</p>
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2"
          placeholder="Misal: x7z-99a-k2l"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button onClick={check} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800">Cek</button>
      </div>
      {status && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm text-left border border-blue-100 animate-fade-in">
          <strong>Status Terkini:</strong><br/>{status}
        </div>
      )}
    </div>
  );
}

const DashboardData: React.FC = () => (
  <div className="max-w-6xl mx-auto py-8 px-4">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">Pusat Data Perdamaian</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Dampak Kegiatan Per Bulan (Orang)</h3>
        <ImpactChart />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Status Zona Nasional</h3>
        <ZoneStatusChart />
      </div>
    </div>
    <div className="bg-trust text-white p-8 rounded-xl relative overflow-hidden">
       <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Jadilah Peace Ambassador</h3>
          <p className="text-slate-300 mb-6 max-w-xl">Bergabunglah dengan 5,000+ relawan terverifikasi untuk mendapatkan akses dashboard eksklusif, pelatihan mitigasi konflik, dan badges kontribusi.</p>
          <button className="bg-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition">Daftar Sekarang</button>
       </div>
       <div className="absolute right-0 bottom-0 opacity-10">
          <Shield className="w-64 h-64 -mb-10 -mr-10" />
       </div>
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock Ticket Generation
  const generateTicket = () => Math.random().toString(36).substring(2, 15).toUpperCase();

  const handleThreatSubmit = async (data: any) => {
    if (data.dryRun) {
      // Simulate AI Analysis
      setIsAnalyzing(true);
      const analysis = await analyzeReportContent(data.desc, 'THREAT');
      setIsAnalyzing(false);
      data.onResult(analysis);
      return;
    }

    // Real Submit
    const newReport: Report = {
      id: Date.now().toString(),
      type: ReportType.THREAT,
      title: `Laporan Ancaman #${Math.floor(Math.random()*1000)}`,
      description: data.desc,
      location: data.location,
      timestamp: Date.now(),
      status: ReportStatus.PENDING,
      ticketCode: generateTicket(),
      threatLevel: data.analysis?.sentimentScore > 80 ? ThreatLevel.HIGH : ThreatLevel.MEDIUM,
      isRedacted: true
    };

    setReports([newReport, ...reports]);
    alert(`Laporan Diterima. Simpan Tiket Anda: ${newReport.ticketCode}`);
    setCurrentPage('home');
  };

  const handlePeaceSubmit = (data: any) => {
    const newReport: Report = {
      id: Date.now().toString(),
      type: ReportType.PEACE,
      title: data.title,
      description: data.desc,
      location: data.location,
      timestamp: Date.now(),
      status: ReportStatus.APPROVED,
      organizer: data.organizer,
      impactCount: Math.floor(Math.random() * 100) + 10, // Mock impact
      imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`
    };
    setReports([newReport, ...reports]);
    alert("Kabar damai berhasil disebarkan!");
    setCurrentPage('feed');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <LandingPage setPage={setCurrentPage} stats={{}} />;
      case 'report-threat': return <ReportThreat onSubmit={handleThreatSubmit} isAnalyzing={isAnalyzing} />;
      case 'report-peace': return <ReportPeace onSubmit={handlePeaceSubmit} />;
      case 'feed': return <Feed reports={reports} />;
      case 'check-ticket': return <CheckTicket />;
      case 'dashboard': return <DashboardData />;
      default: return <LandingPage setPage={setCurrentPage} stats={{}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar setPage={setCurrentPage} activePage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Damai Hub. Menjaga Kebhinekaan, Merawat Indonesia.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-blue-900">Kebijakan Privasi</a>
            <a href="#" className="hover:text-blue-900">Panduan Komunitas</a>
            <a href="#" className="hover:text-blue-900">Kontak Darurat</a>
          </div>
        </div>
      </footer>
      
      <QuickExit />
    </div>
  );
};

export default App;