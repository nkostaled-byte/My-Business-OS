import React from 'react';
import { NavLink } from 'react-router-dom';
import { MY_GRAFIX_LOGO } from '../../constants';

const PLATFORM_NAME = 'My Business OS';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-8 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src={MY_GRAFIX_LOGO} alt={PLATFORM_NAME} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold text-white">{PLATFORM_NAME}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
            The complete operating system for modern business teams. Bookings, POS, Orders, Invoices, Inventory, and CRM in one platform.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3.5">Product</h4>
          <ul className="space-y-2.5">
            <li><NavLink to="/features" className="text-xs text-slate-500 hover:text-white transition-colors">Features</NavLink></li>
            <li><NavLink to="/pricing" className="text-xs text-slate-500 hover:text-white transition-colors">Pricing</NavLink></li>
            <li><NavLink to="/resources" className="text-xs text-slate-500 hover:text-white transition-colors">Resources</NavLink></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3.5">Company</h4>
          <ul className="space-y-2.5">
            <li><NavLink to="/company" className="text-xs text-slate-500 hover:text-white transition-colors">About Us</NavLink></li>
            <li><NavLink to="/contact" className="text-xs text-slate-500 hover:text-white transition-colors">Contact</NavLink></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3.5">Legal</h4>
          <ul className="space-y-2.5">
            <li><NavLink to="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</NavLink></li>
            <li><NavLink to="/security" className="text-xs text-slate-500 hover:text-white transition-colors">Security</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <p>&copy; 2026 My Grafix Media. All rights reserved.</p>
        <p>Powered by My Grafix Media</p>
      </div>
    </footer>
  );
};
