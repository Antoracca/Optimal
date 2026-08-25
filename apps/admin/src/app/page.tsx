"use client";

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Wallet, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  Check
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'transfers' | 'liquidity' | 'cash_pickup'>('transfers');
  const [pickupRef, setPickupRef] = useState('');
  const [pickupCode, setPickupCode] = useState('');
  const [pickupIdDoc, setPickupIdDoc] = useState('');
  const [pickupStatus, setPickupStatus] = useState<string | null>(null);

  // Données de démonstration connectées à l'architecture
  const pools = [
    { country: 'Gabon', flag: '🇬🇦', currency: 'XAF', balance: '25 000 000', provider: 'Airtel Money', status: 'optimal' },
    { country: 'Cameroun', flag: '🇨🇲', currency: 'XAF', balance: '30 000 000', provider: 'Orange & MTN', status: 'optimal' },
    { country: 'RDC', flag: '🇨🇩', currency: 'CDF', balance: '50 000 000', provider: 'Airtel Money', status: 'optimal' },
    { country: 'Maroc', flag: '🇲🇦', currency: 'MAD', balance: '420 000', provider: 'ChariBaaS & Guichet', status: 'optimal' },
  ];

  const transfers = [
    { ref: 'OPT-2026-X892J', sender: 'Brice Ondimba (Gabon)', amountSend: '300 000 XAF', amountRecv: '4 800 MAD', recipient: 'Yacine B. (Casablanca)', method: 'Virement (Attijariwafa)', status: 'COMPLETED', time: 'Il y a 10 min' },
    { ref: 'OPT-2026-K491P', sender: 'Pauline Mballa (Cameroun)', amountSend: '150 000 XAF', amountRecv: '2 400 MAD', recipient: 'Aminata S. (Rabat)', method: 'Espèces (Point Relais)', status: 'PAYOUT_PENDING', time: 'Il y a 25 min' },
    { ref: 'OPT-2026-M772R', sender: 'Dieudonné Kazadi (RDC)', amountSend: '1 200 000 CDF', amountRecv: '4 260 MAD', recipient: 'Omar T. (Tanger)', method: 'Virement (CIH)', status: 'PROCESSING', time: 'Il y a 40 min' },
  ];

  const handleDownloadExcel = () => {
    window.open('http://localhost:4000/api/v1/reports/daily-excel', '_blank');
  };

  const handleValidatePickup = (e: React.FormEvent) => {
    e.preventDefault();
    setPickupStatus('SUCCESS');
    setTimeout(() => {
      setPickupStatus(null);
      setPickupRef('');
      setPickupCode('');
      setPickupIdDoc('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            OPT
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Optimal Remittance</h1>
            <p className="text-xs text-slate-400">Portail Opérations & Trésorerie Internationale</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            Exporter Rapport Excel (Journée)
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-emerald-400">
              AD
            </div>
            <div className="text-left text-xs">
              <p className="font-medium text-slate-200">Super Admin</p>
              <p className="text-slate-500">Connecté (Maroc)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Volume Aujourd'hui</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-50 tracking-tight">84 200 MAD</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">+18.4% par rapport à hier</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Transactions Validées</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-50 tracking-tight">42</p>
            <p className="text-xs text-slate-400 mt-2">100% automatisées (ChariBaaS)</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Trésorerie Maroc (MAD)</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">420 000 MAD</p>
            <p className="text-xs text-slate-400 mt-2">Solde ChariBaaS disponible</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Trésorerie Gabon (XAF)</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-blue-400 tracking-tight">25 000 000</p>
            <p className="text-xs text-slate-400 mt-2">Solde Airtel Gabon</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 gap-8">
          <button
            onClick={() => setActiveTab('transfers')}
            className={`pb-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'transfers'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Flux des Transferts en Direct
          </button>

          <button
            onClick={() => setActiveTab('liquidity')}
            className={`pb-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'liquidity'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Pools de Liquidités & Compensation
          </button>

          <button
            onClick={() => setActiveTab('cash_pickup')}
            className={`pb-4 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'cash_pickup'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Guichet Points Relais (Validation Retrait)
          </button>
        </div>

        {/* Tab 1: Transfers Table */}
        {activeTab === 'transfers' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="font-semibold text-slate-200">Dernières Transactions</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Mise à jour en temps réel via Webhooks
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Référence</th>
                    <th className="px-6 py-3">Expéditeur</th>
                    <th className="px-6 py-3">Montant Envoyé</th>
                    <th className="px-6 py-3">Montant Reçu (MAD)</th>
                    <th className="px-6 py-3">Bénéficiaire (Maroc)</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {transfers.map((t) => (
                    <tr key={t.ref} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">{t.ref}</td>
                      <td className="px-6 py-4 font-medium text-slate-100">{t.sender}</td>
                      <td className="px-6 py-4">{t.amountSend}</td>
                      <td className="px-6 py-4 font-bold text-slate-100">{t.amountRecv}</td>
                      <td className="px-6 py-4">{t.recipient}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{t.method}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.status === 'COMPLETED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : t.status === 'PAYOUT_PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Liquidity Pools */}
        {activeTab === 'liquidity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pools.map((p) => (
              <div key={p.country} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg text-slate-100">{p.country}</h3>
                      <p className="text-xs text-slate-400">{p.provider}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium border border-emerald-500/20">
                    Solde Opérationnel
                  </span>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Solde Disponible</span>
                  <span className="text-2xl font-mono font-bold text-slate-100">{p.balance} {p.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Cash Pickup Desk (Agent Relais) */}
        {activeTab === 'cash_pickup' && (
          <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Guichet de Retrait Espèces (Point Relais)</h2>
                <p className="text-xs text-slate-400">Validez le code secret et la pièce d'identité avant de remettre l'argent</p>
              </div>
            </div>

            {pickupStatus === 'SUCCESS' && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-bold text-sm">Retrait validé avec succès !</p>
                  <p className="text-xs text-emerald-300">Argent remis au bénéficiaire. Le transfert est désormais clôturé.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleValidatePickup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Référence du transfert</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: OPT-2026-K491P"
                  value={pickupRef}
                  onChange={(e) => setPickupRef(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Code Secret OTP (6 chiffres)</label>
                <input 
                  type="password" 
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={pickupCode}
                  onChange={(e) => setPickupCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Numéro de pièce d'identité (CIN / Passeport)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: BE123456"
                  value={pickupIdDoc}
                  onChange={(e) => setPickupIdDoc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-6"
              >
                <CheckCircle2 className="w-5 h-5" />
                Valider le retrait & Remettre les fonds
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
