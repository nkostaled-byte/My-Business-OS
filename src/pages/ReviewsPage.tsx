import React from 'react';
import { useData } from '../context/DataContext';
import { Star, MessageSquare } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const ReviewsPage: React.FC = () => {
  const { reviews } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Client Feedback & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor online client ratings, testimonials, and feedback scores.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
          <EmptyState
            icon={Star}
            title="No client reviews yet"
            description="Client reviews submitted on your storefront or Google Business profile will appear here."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {rev.clientName}
                  </span>
                  <span className="text-[10px] text-slate-400">• {rev.date}</span>
                </div>

                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "{rev.comment}"
              </p>

              {rev.serviceName && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>Service: {rev.serviceName}</span>
                  <button
                    onClick={() => alert('Respond to review flow placeholder')}
                    className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" /> Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
