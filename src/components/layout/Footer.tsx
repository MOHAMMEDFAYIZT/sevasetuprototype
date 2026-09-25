import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 md:pb-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-800 flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 120 100" fill="none">
                  <circle cx="38" cy="22" r="10" fill="#ffffff" />
                  <path d="M18 64C18 44 26 34 46 34C60 34 68 46 72 58C62 50 48 48 38 52C28 56 22 64 18 64Z" fill="#ffffff" />
                  <circle cx="82" cy="22" r="10" fill="#E88A1A" />
                  <path d="M102 64C102 44 94 34 74 34C60 34 52 46 48 58C58 50 72 48 82 52C92 56 98 64 102 64Z" fill="#E88A1A" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">Seva Setu</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Skilled People. Stronger Communities. Direct local matching for household, agricultural, and construction services across Palakkad.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero commissions · Direct worker contact</span>
            </div>
          </div>

          {/* Col 2: Top Services */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">
              Popular Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/create-job" className="hover:text-white transition-colors">⚡ Electrician & Fan Wiring</Link></li>
              <li><Link to="/create-job" className="hover:text-white transition-colors">🚰 Plumber & Motor Repair</Link></li>
              <li><Link to="/create-job" className="hover:text-white transition-colors">🧹 Full House & Tank Cleaning</Link></li>
              <li><Link to="/create-job" className="hover:text-white transition-colors">🎨 Wall Painting & Whitewash</Link></li>
              <li><Link to="/create-job" className="hover:text-white transition-colors">🌾 Paddy & Agriculture Helper</Link></li>
              <li><Link to="/create-job" className="hover:text-white transition-colors">🪚 Carpenter & Furniture Repair</Link></li>
            </ul>
          </div>

          {/* Col 3: Coverage Localities */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">
              Coverage Localities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron-500" /> Palakkad Town & Chittur</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron-500" /> Alathur & Kuzhalmannam</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron-500" /> Nenmara & Kollengode</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron-500" /> Ottapalam & Pattambi</li>
            </ul>
          </div>

          {/* Col 4: Platform Rules */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">
              How It Works
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              You send requests to multiple nearby independent workers (15–20 km). The first worker to accept gets connected with you directly.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              🔒 Direct phone coordination & in-person cash payment.
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Seva Setu · Connecting Local Talent with Local Needs.
        </div>

      </div>
    </footer>
  );
};
