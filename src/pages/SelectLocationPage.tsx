import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Search, 
  Crosshair, 
  Plus, 
  Home, 
  Briefcase, 
  MoreHorizontal, 
  Share2, 
  MapPin, 
  Pencil, 
  Check,
  X
} from 'lucide-react';

interface SavedAddressItem {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  address: string;
  phone: string;
  distance: string;
  shortLocation: string;
}

// Real locations & streets in Palakkad for authentic real-app autocomplete search
const REAL_SEARCH_SUGGESTIONS = [
  { name: 'Civil Station Road', area: 'Fort Maidan, Palakkad 678001' },
  { name: 'Court Road & Sultanpet', area: 'Near Head Post Office, Palakkad 678001' },
  { name: 'Robinson Road & Stadium Bypass', area: 'Stadium Junction, Palakkad 678001' },
  { name: 'TB Road & Bus Stand Area', area: 'Near KSRTC Depo, Palakkad 678014' },
  { name: 'Kinfra Industrial Techno Park', area: 'Near NH544 Highway, Palakkad 678621' },
  { name: 'Canal Bund Road', area: 'Near Thrikkadeeri Temple, Kuzhalmannam 678702' },
  { name: 'Main Bazaar Road', area: 'Panchayat Office Road, Chittur 678101' },
  { name: 'Victoria College Road', area: 'Near Govt Victoria College, Palakkad 678001' },
  { name: 'Chandranagar Colony', area: 'Near Bypass Junction, Palakkad 678007' }
];

export const SelectLocationPage: React.FC = () => {
  const { user, updateUser, updateDraftJob, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newHouseNo, setNewHouseNo] = useState('');
  const [newStreet, setNewStreet] = useState('');

  // Default realistic saved addresses (Matching Zomato screenshot)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressItem[]>([
    {
      id: 'addr-1',
      type: 'Home',
      label: 'Home',
      address: 'Sri Krishna Nilayam, Civil Station Rd, Fort Maidan, Palakkad 678001',
      phone: `+91-${user.phone || '9447397145'}`,
      distance: '0 m',
      shortLocation: 'Civil Station Rd, Fort Maidan'
    },
    {
      id: 'addr-2',
      type: 'Work',
      label: 'Work',
      address: 'Block B, Kinfra Industrial Techno Park, Near NH544, Palakkad 678621',
      phone: `+91-${user.phone || '9447397145'}`,
      distance: '3.2 km',
      shortLocation: 'Kinfra Industrial Park'
    },
    {
      id: 'addr-3',
      type: 'Other',
      label: 'Farmhouse',
      address: 'Plot #14, Canal Bund Road, Near Thrikkadeeri, Kuzhalmannam 678702',
      phone: `+91-${user.phone || '9447397145'}`,
      distance: '8.5 km',
      shortLocation: 'Canal Bund Rd, Kuzhalmannam'
    }
  ]);

  const handleSelectAddress = (addr: SavedAddressItem) => {
    updateUser({ location: addr.shortLocation });
    updateDraftJob({ location: addr.shortLocation });
    showToast(`Location set to ${addr.label} (${addr.shortLocation})`);
    navigate(-1);
  };

  const handleUseCurrentLocation = () => {
    const loc = 'Fort Maidan, Palakkad';
    updateUser({ location: loc });
    updateDraftJob({ location: loc });
    showToast('Detected current location via GPS');
    navigate(-1);
  };

  const handleSelectSearchResult = (result: typeof REAL_SEARCH_SUGGESTIONS[0]) => {
    updateUser({ location: result.name });
    updateDraftJob({ location: result.name });
    showToast(`Location set to ${result.name}`);
    navigate(-1);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) {
      showToast('Please enter street or locality name');
      return;
    }
    const fullAddr = newHouseNo.trim() ? `${newHouseNo.trim()}, ${newStreet.trim()}` : newStreet.trim();
    const newAddrItem: SavedAddressItem = {
      id: `addr-${Date.now()}`,
      type: newLabel,
      label: newLabel,
      address: `${fullAddr}, Palakkad`,
      phone: `+91-${user.phone || '9447397145'}`,
      distance: '1.2 km',
      shortLocation: newStreet.trim()
    };
    setSavedAddresses(prev => [newAddrItem, ...prev]);
    updateUser({ location: newStreet.trim() });
    updateDraftJob({ location: newStreet.trim() });
    setShowAddForm(false);
    setNewHouseNo('');
    setNewStreet('');
    showToast(`${newLabel} address saved and selected`);
    navigate(-1);
  };

  const filteredSuggestions = REAL_SEARCH_SUGGESTIONS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.area.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-5 pt-0 pb-36 sm:pb-40 min-h-full relative">
      {/* Back button at the top */}
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/profile');
          }
        }}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-[#16261E] hover:text-[#0C6B44] transition-all cursor-pointer border border-white shadow-[0_2px_8px_rgba(16,60,38,0.06)] active:scale-95"
        title="Go back"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Header title at mt-22 starting at the same level as the cards */}
      <div className="mt-22 mb-3 select-none">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#16261E] tracking-tight leading-tight">
          Select a location
        </h1>
        <p className="text-xs text-[#4F6057] font-medium mt-0.5">
          Choose where you need service assistance
        </p>
      </div>

      <div className="space-y-4">
        {/* Search Bar (Real app search style) */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#0C6B44] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for area, street name..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-[#CBD8CA] focus:border-[#0C6B44] text-xs font-semibold text-[#16261E] placeholder:text-[#76857D] outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Real search autocomplete results if searching */}
        {searchQuery.trim().length > 0 && (
          <div className="bg-white rounded-2xl border border-[#CBD8CA] overflow-hidden divide-y divide-[#F0F5EE] shadow-sm animate-fade-in select-none">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(sug)}
                  className="w-full p-3.5 flex items-start gap-3 text-left hover:bg-[#F6FAF4] transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#0C6B44] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-sm font-bold text-[#16261E]">
                      {sug.name}
                    </h4>
                    <p className="text-xs text-[#76857D] font-normal mt-0.5">
                      {sug.area}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[#76857D]">
                No matching locations found. Try another landmark or street.
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Card (Seva Setu Forest Green Theme) */}
        {!searchQuery && (
          <div className="bg-white rounded-2xl border border-[#CBD8CA] overflow-hidden divide-y divide-[#F0F5EE] shadow-2xs select-none">
            {/* 1. Use Current Location */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Crosshair className="w-4 h-4 text-[#0C6B44] shrink-0" />
                <div>
                  <span className="font-display text-sm font-bold text-[#0C6B44] group-hover:text-[#0A5A39] block">
                    Use current location
                  </span>
                  <span className="text-[11px] text-[#76857D] font-normal block mt-0.5">
                    Using GPS • Fort Maidan, Palakkad
                  </span>
                </div>
              </div>
              <span className="text-[#CBD8CA] group-hover:text-[#0C6B44] text-sm font-bold">›</span>
            </button>

            {/* 2. Add Address */}
            <button
              type="button"
              onClick={() => setShowAddForm(prev => !prev)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F6FAF4] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#0C6B44] shrink-0" />
                <span className="font-display text-sm font-bold text-[#0C6B44] group-hover:text-[#0A5A39]">
                  Add Address
                </span>
              </div>
              <span className="text-[#CBD8CA] group-hover:text-[#0C6B44] text-sm font-bold">›</span>
            </button>
          </div>
        )}

        {/* Inline Add Address Form when Add Address is clicked */}
        {showAddForm && (
          <form onSubmit={handleSaveNewAddress} className="p-4 bg-white rounded-2xl border border-[#0C6B44] shadow-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-bold text-[#16261E] uppercase tracking-wider">
                Add New Address
              </h4>
              <div className="flex gap-1.5">
                {(['Home', 'Work', 'Other'] as const).map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                      newLabel === lbl ? 'bg-[#0C6B44] text-white' : 'bg-[#F6FAF4] text-[#4F6057] border border-[#CBD8CA]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#76857D] font-bold block mb-1">House / Flat / Building No.</label>
              <input
                type="text"
                value={newHouseNo}
                onChange={(e) => setNewHouseNo(e.target.value)}
                placeholder="e.g. Flat 302, Green Villa"
                className="w-full h-9 px-3 rounded-xl border border-[#CBD8CA] bg-white text-xs font-semibold text-[#16261E] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#76857D] font-bold block mb-1">Street, Area, Landmark</label>
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="e.g. Robinson Road, Near Stadium"
                className="w-full h-9 px-3 rounded-xl border border-[#CBD8CA] bg-white text-xs font-semibold text-[#16261E] outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 h-9 rounded-full bg-[#0C6B44] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save & Use Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 h-9 rounded-full bg-[#F6FAF4] text-[#4F6057] font-bold text-xs border border-[#CBD8CA] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* SAVED ADDRESSES SECTION (Exact layout from Zomato screenshot) */}
        {!searchQuery && (
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-[#76857D] uppercase tracking-wider px-1">
              SAVED ADDRESSES
            </h3>

            <div className="space-y-3">
              {savedAddresses.map((addr) => {
                const isSelected = user.location?.toLowerCase().includes(addr.shortLocation.toLowerCase());

                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs space-y-2.5 group select-none ${
                      isSelected 
                        ? 'border-[#0C6B44] ring-1 ring-[#0C6B44]/25' 
                        : 'border-[#E3ECE0] hover:border-[#CBD8CA]'
                    }`}
                  >
                    {/* Top Row: Icon + Title + Address + In use Badge */}
                    <div className="flex items-start gap-3">
                      {/* Left Icon with Distance below it */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#F6FAF4] border border-[#CBD8CA] flex items-center justify-center text-[#16261E]">
                          {addr.type === 'Home' ? (
                            <Home className="w-4 h-4 stroke-[2]" />
                          ) : (
                            <Briefcase className="w-4 h-4 stroke-[2]" />
                          )}
                        </div>
                        <span className="text-[10px] text-[#76857D] font-medium mt-1">
                          {addr.distance}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold text-[#16261E]">
                            {addr.label}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E2F3DD] text-[#0C6B44] text-[10px] font-bold border border-[#3AAA48]/30">
                              In use
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4F6057] font-normal leading-relaxed mt-1 line-clamp-2">
                          {addr.address}
                        </p>

                        <p className="text-[11px] text-[#76857D] font-medium mt-1">
                          Phone number: {addr.phone}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#0C6B44] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Icons (•••, share, edit) like Zomato */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F0F5EE] text-[#76857D]">
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); showToast('Address options'); }}
                        className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#0C6B44] transition-colors"
                        title="Options"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); showToast('Address copied to clipboard'); }}
                        className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#0C6B44] transition-colors"
                        title="Share location"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); showToast(`Editing ${addr.label} address`); }}
                        className="w-7 h-7 rounded-full bg-[#F6FAF4] hover:bg-[#E2F3DD] flex items-center justify-center text-[#76857D] hover:text-[#0C6B44] transition-colors"
                        title="Edit address"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Generous empty space at the bottom so last address card never touches the bottom window of phone */}
        <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

