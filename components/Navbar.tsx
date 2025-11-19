import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Activity, Bell } from 'lucide-react';

interface NavbarProps {
  setPage: (page: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ setPage, activePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'feed', label: 'Pantau Aktivitas' },
    { id: 'dashboard', label: 'Pusat Data' },
    { id: 'check-ticket', label: 'Cek Tiket' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <ShieldCheck className="h-8 w-8 text-blue-900 mr-2" />
            <span className="font-bold text-xl tracking-tight text-blue-900">DAMAI<span className="text-teal-500">HUB</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`${
                  activePage === item.id 
                    ? 'text-blue-900 border-b-2 border-blue-900' 
                    : 'text-slate-500 hover:text-blue-700'
                } px-1 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.label}
              </button>
            ))}
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-alert rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};