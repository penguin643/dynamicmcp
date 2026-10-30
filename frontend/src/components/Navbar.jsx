import React from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  toolsCount = 0,
  onRefresh,
  loading = false,
}) {
  const tabs = [
    { id: 'assembly-studio', label: 'Assembly Studio' },
    { id: 'installed-tools', label: `Installed Tools (${toolsCount})` },
    { id: 'security-sandboxes', label: 'Security & Sandboxes (NemoClaw)' },
    { id: 'audit-telemetry', label: 'Audit Trail' },
    { id: 'hermes-agent-sessions', label: 'Hermes Agent Sessions' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAE3EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#FF6082] text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-[#FF6082]/20">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#1E1B26] text-base tracking-tight">DynamicMCP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFE5F5] border border-[#FF6082]/30 text-[#FF6082] font-semibold">
                v1.0
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5EDF5] p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-white text-[#7057FF] shadow-sm'
                      : 'text-[#766F82] hover:text-[#1E1B26] hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status Cluster & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F8F2F7] border border-[#EAE3EA] text-[#766F82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6082] animate-pulse"></span>
              <span>Hermes IPC: <strong className="text-[#FF6082]">Connected</strong></span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F8F2F7] border border-[#EAE3EA] text-[#766F82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7057FF]"></span>
              <span>Token Factory: <strong className="text-[#7057FF]">Online</strong></span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F8F2F7] border border-[#EAE3EA] text-[#766F82]">
              <span className="text-[#9B51E0] font-bold">Landlock ABI v3</span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Sync backend state"
            className="p-1.5 rounded-lg border border-[#EAE3EA] bg-white text-[#766F82] hover:text-[#1E1B26] hover:border-[#7057FF]/40 transition-colors shadow-sm"
          >
            <span className={`material-symbols-outlined text-[17px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>

          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#7057FF] hover:bg-[#7057FF]/90 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm shadow-[#7057FF]/20"
          >
            <span>REST Docs</span>
            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Mobile nav fallback */}
      <div className="md:hidden flex items-center gap-1 bg-[#F5EDF5] p-1 border-t border-[#EAE3EA] overflow-x-auto px-4">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                active ? 'bg-white text-[#7057FF] shadow-sm' : 'text-[#766F82]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
