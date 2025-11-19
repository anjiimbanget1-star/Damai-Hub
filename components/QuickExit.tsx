import React from 'react';
import { LogOut } from 'lucide-react';

export const QuickExit: React.FC = () => {
  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <button
      onClick={handleQuickExit}
      className="fixed bottom-6 right-6 z-50 bg-alert hover:bg-alert-dark text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 font-bold text-sm border-2 border-white"
      title="Keluar Cepat (Quick Exit)"
    >
      <LogOut className="h-5 w-5" />
      <span className="hidden md:inline">Quick Exit</span>
    </button>
  );
};