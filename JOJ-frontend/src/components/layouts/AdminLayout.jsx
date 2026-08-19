import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Menu, X } from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar"; 

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar fixe sur Desktop */}
      <div className="hidden md:block w-[240px] shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar sur Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[240px] h-full overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Administrateur */}
        <header 
          className={`sticky top-0 z-30 bg-white transition-shadow duration-200 ${
            scroll ? "shadow-md" : "border-b border-gray-100"}`}>
          <div className="flex items-center justify-between px-4 md:px-8 h-20">
            <div className="flex items-center gap-3 flex-1">
              <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="hidden md:flex items-center bg-[#F1F5F9] rounded-full px-4 py-2.5 gap-2 w-80">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent outline-none text-xs w-full text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative cursor-pointer">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#f28c28] border-2 border-white" />
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">Admin JOJ</p>
                  <p className="text-[11px] text-gray-400 font-medium">Super Administrateur</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Avatar Administrateur"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Zone des pages de contenu */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}