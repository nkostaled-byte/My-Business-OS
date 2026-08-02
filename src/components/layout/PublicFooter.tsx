import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { MY_GRAFIX_LOGO } from '../../constants';

export const PublicFooter: React.FC = () => {
  const { businessName, businessLogo } = useData();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
              <img src={businessLogo || MY_GRAFIX_LOGO} alt={businessName} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-white">{businessName || 'Business OS'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The complete operating system for modern business teams. Bookings, POS, Orders, Invoices, Inventory, and CRM in one platform.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <NavLink to="/features" className="hover:text-white transition-colors">
                Features
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" className="hover:text-white transition-colors">
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink to="/resources" className="hover:text-white transition-colors">
                Resources
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <NavLink to="/company" className="hover:text-white transition-colors">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/careers" className="hover:text-white transition-colors">
                Careers
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-white transition-colors">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <NavLink to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </NavLink>
            </li>
            <li>
              <NavLink to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </NavLink>
            </li>
            <li>
              <NavLink to="/security" className="hover:text-white transition-colors">
                Security
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 My Grafix Media. All rights reserved.</p>
        <p>Powered by My Grafix Media</p>
      </div>
    </footer>
  );
};
