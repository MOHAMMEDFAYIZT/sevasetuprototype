import React from 'react';
import { useApp } from '../context/AppContext';
import { WORKERS_DATABASE } from '../data/mockData';
import { Heart, Star, ArrowRight, Award } from 'lucide-react';

export const FavouritesView: React.FC = () => {
  const { favourites, toggleFavourite, requestFavouriteDirectly, navigateTo } = useApp();

  const favWorkers = WORKERS_DATABASE.filter(w => favourites.includes(w.id));

  return (
    <div className="flex-1 px-4 py-4 pb-24 bg-[#f8faf9]">
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Saved Workers
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Quickly re-request your trusted independent workers
        </p>
      </div>

      {favWorkers.length > 0 ? (
        <div className="space-y-3">
          {favWorkers.map(worker => (
            <div
              key={worker.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-800 font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                    {worker.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {worker.name}
                      </h3>
                      <Award className="w-3.5 h-3.5 text-brand-700" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      {worker.category}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavourite(worker.id)}
                  className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer hover:bg-rose-100 transition-colors"
                  title="Remove Favourite"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {worker.rating}
                </span>
                <span>📍 {worker.distance} km away</span>
                <span className="text-brand-800 font-black">{worker.wage}</span>
              </div>

              <button
                onClick={() => requestFavouriteDirectly(worker.id)}
                className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Request {worker.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <span className="text-4xl block mb-2">♥</span>
          <h3 className="text-sm font-extrabold text-slate-900">No favourites yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tap the heart icon on any worker card to save them here for fast 1-tap requests.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Find workers
          </button>
        </div>
      )}

    </div>
  );
};
