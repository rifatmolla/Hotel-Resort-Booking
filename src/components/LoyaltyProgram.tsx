import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  Sparkles,
  Gift,
  Award,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const LoyaltyProgram: React.FC = () => {
  const { loyaltyProfile, createBooking } = useApp();
  const [redeemedAlert, setRedeemedAlert] = useState<string | null>(null);

  const rewards = [
    { id: 'rw-1', title: 'Veuve Clicquot Champagne in Suite', cost: 2500, category: 'Food & Beverage' },
    { id: 'rw-2', title: 'Private Mercedes Maybach Airport Transfer', cost: 5000, category: 'Transportation' },
    { id: 'rw-3', title: '90-Min Holistic Hot Stone Spa Ritual', cost: 7500, category: 'Wellness' },
    { id: 'rw-4', title: 'Private Sunset Catamaran Sailing', cost: 12000, category: 'Experience' },
    { id: 'rw-5', title: 'Complimentary Night at Any 5-Star Resort', cost: 25000, category: 'Stay' },
  ];

  const tiers = [
    {
      name: 'Silver',
      nights: '0-9 nights',
      multiplier: '1.0x',
      perks: ['Member-only rates', 'Complimentary fiber WiFi', 'Digital check-in & keycard'],
    },
    {
      name: 'Gold',
      nights: '10-24 nights',
      multiplier: '1.25x',
      perks: ['Complimentary gourmet breakfast', '2:00 PM late check-out', 'Welcome drink ceremony'],
    },
    {
      name: 'Platinum',
      nights: '25-49 nights',
      multiplier: '1.5x',
      current: true,
      perks: ['Room upgrades upon availability', 'Guaranteed 4:00 PM late check-out', '$100 resort credit per stay', 'VIP lounge access'],
    },
    {
      name: 'VIP Black',
      nights: '50+ nights',
      multiplier: '2.0x',
      perks: ['Private helicopter transfer allowance', 'Guaranteed suite upgrades', '24/7 Dedicated Butler concierge', 'Gift tier to a partner'],
    },
  ];

  const handleRedeem = (reward: { title: string; cost: number }) => {
    if (loyaltyProfile.points < reward.cost) {
      setRedeemedAlert(`Insufficient points. You need ${reward.cost.toLocaleString()} points.`);
      setTimeout(() => setRedeemedAlert(null), 3000);
      return;
    }
    setRedeemedAlert(`Reward claimed: "${reward.title}" has been added to your vouchers vault!`);
    setTimeout(() => setRedeemedAlert(null), 3500);
  };

  const progressPercent = Math.min(100, Math.round((loyaltyProfile.nightsThisYear / loyaltyProfile.annualNightsForNextTier) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Exclusive Frequent Guest Circle</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-100">
          LuxeStay Loyalty Rewards
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Earn 1.5x points on every stay, unlock suite upgrades, and redeem world-class travel privileges.
        </p>
      </div>

      {/* Hero Membership Card & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Digital Membership Pass */}
        <div className="lg:col-span-5">
          <div className="aspect-16/10 rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-950 p-6 text-white shadow-2xl border border-stone-700/60 relative overflow-hidden flex flex-col justify-between">
            {/* Shimmer graphic */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  LuxeStay Circle
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-100 mt-0.5">
                  Alex Thorne
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{loyaltyProfile.tier}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-stone-400">Available Points Balance</div>
              <div className="font-serif font-black text-3xl sm:text-4xl text-amber-300 tracking-tight">
                {loyaltyProfile.points.toLocaleString()} <span className="text-xs font-sans font-medium text-stone-300">PTS</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-stone-700/60 pt-3 text-xs">
              <div>
                <div className="text-[10px] text-stone-400">Member ID</div>
                <div className="font-mono text-stone-300">{loyaltyProfile.memberId}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-stone-400">Earn Multiplier</div>
                <div className="font-bold text-amber-400">{loyaltyProfile.multiplier}x Points</div>
              </div>
              <QrCode className="w-7 h-7 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Tier Progress & Benefits */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Progress to VIP Black Tier
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                {loyaltyProfile.nightsThisYear} / {loyaltyProfile.annualNightsForNextTier} Nights (
                {progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
              Stay 7 more nights before Dec 31 to unlock VIP Black with helicopter transfer allowance and dedicated 24/7 personal butler.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Your Active Platinum Privileges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {loyaltyProfile.perks.map((perk, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Redeem Exclusive Perks
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Convert your accumulated points into instant luxury amenities and free nights.
            </p>
          </div>
        </div>

        {redeemedAlert && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in zoom-in-95">
            {redeemedAlert}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((rw) => (
            <div
              key={rw.id}
              className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between space-y-4 hover:border-amber-600/50 transition-all shadow-xs"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  {rw.category}
                </span>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                  {rw.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {rw.cost.toLocaleString()} pts
                </span>
                <button
                  onClick={() => handleRedeem(rw)}
                  className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold rounded-xl transition-colors"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Comparison Breakdown */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
          Membership Tier Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`p-4 rounded-2xl border text-xs space-y-3 ${
                t.current
                  ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {t.name}
                </span>
                {t.current && (
                  <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    Your Tier
                  </span>
                )}
              </div>
              <div className="text-stone-500">{t.nights}</div>
              <div className="font-bold text-amber-700 dark:text-amber-400">
                {t.multiplier} Points Earned
              </div>
              <ul className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-400">
                {t.perks.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Points History Log */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-400" />
          <span>Points Activity History</span>
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {loyaltyProfile.history.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-stone-800 dark:text-stone-200">{item.description}</div>
                <div className="text-[11px] text-stone-400">{item.date}</div>
              </div>
              <span
                className={`font-mono font-bold ${
                  item.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                }`}
              >
                {item.type === 'earned' ? '+' : '-'}
                {item.points.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
