import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShieldCheck,
  Smile,
  ArrowUpRight,
  Sparkles,
  Zap,
  Globe,
  Award,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { bookings, loyaltyProfile, hotels } = useApp();

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.status === 'confirmed' ? b.totalPrice : 0), 142800);

  const metrics = [
    {
      label: 'Gross Booking Volume',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+18.4%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Loyalty Retention Rate',
      value: '88.6%',
      change: '+4.2%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'Guest Satisfaction',
      value: '9.8 / 10',
      change: '+0.3',
      isPositive: true,
      icon: Smile,
    },
    {
      label: 'Biometric Checkouts',
      value: '94.2%',
      change: '+12.5%',
      isPositive: true,
      icon: ShieldCheck,
    },
  ];

  const destinationAnalytics = [
    { name: 'Tokyo, Japan', percentage: 38, count: '312 Stays' },
    { name: 'Amalfi Coast, Italy', percentage: 24, count: '198 Stays' },
    { name: 'Bora Bora, French Polynesia', percentage: 18, count: '145 Stays' },
    { name: 'St. Moritz, Swiss Alps', percentage: 12, count: '98 Stays' },
    { name: 'Paris & Dubai', percentage: 8, count: '64 Stays' },
  ];

  const featureEngagement = [
    { feature: 'Instant Room Availability Lock', usage: '99.4%', status: 'Optimal' },
    { feature: 'Biometric Passkey Authentication', usage: '94.2%', status: 'High' },
    { feature: 'Offline Map Pack Downloads', usage: '76.8%', status: 'Growing' },
    { feature: 'Calendar Synchronization (.ICS & Google)', usage: '89.1%', status: 'Optimal' },
    { feature: '24/7 VIP Butler Concierge Chat', usage: '68.5%', status: 'Active' },
    { feature: 'Voice-Assisted Search Navigation', usage: '41.2%', status: 'Active' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Real-Time Performance Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-100">
          Analytics & Engagement Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Live monitoring of guest retention, luxury revenue, reservation velocity, and feature adoption.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
                <span className="font-semibold">{m.label}</span>
                <Icon className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {m.value}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Analytics Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Destination Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" />
              <span>Sanctuary Popularity & Geographic Demand</span>
            </h2>
            <span className="text-[11px] text-stone-400">Past 30 Days</span>
          </div>

          <div className="space-y-4">
            {destinationAnalytics.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-stone-400">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Engagement & Conversion Telemetry */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Feature Adoption & Retention Metrics</span>
            </h2>
            <span className="text-[11px] text-emerald-600 font-bold">Live Pulse</span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {featureEngagement.map((f, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="text-stone-700 dark:text-stone-300 font-medium">
                  {f.feature}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {f.usage}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
