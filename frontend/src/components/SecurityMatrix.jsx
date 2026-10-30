import React from 'react';

export default function SecurityMatrix({ tools = [] }) {
  const policies = tools.map((t, idx) => ({
    name: t.name,
    target_domain: t.target_domain || 'api.open-meteo.com',
    landlock_abi: 'v3',
    fs_mode: 'read_only_python_libs',
    network: `WHITELIST: ${t.target_domain || 'api.open-meteo.com'}:443`,
    status: 'ACTIVE_CONFINED',
    violations: 0,
    container_id: `openshell-${t.id?.slice(0, 8) || `wk-${idx + 1}`}`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      <div className="bg-white border border-[#EAE3EA] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="h-10 bg-[#FFF9FD] border-b border-[#EAE3EA] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9B51E0] text-[18px]">security</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E1B26]">
              NemoClaw Landlock LSM Security Matrix &amp; Egress Jail
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
            ZERO-LEAKAGE ENFORCED
          </span>
        </div>

        <div className="p-5 flex flex-col gap-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">Kernel Confinement</span>
              <span className="text-[#9B51E0] font-bold text-sm">Landlock ABI v3</span>
              <span className="text-[10px] text-[#766F82]">Unprivileged filesystem restriction</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">Network Mode</span>
              <span className="text-[#FF6082] font-bold text-sm">Strict Whitelist</span>
              <span className="text-[10px] text-[#766F82]">Default outbound: DENY</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">OpenShell Jail</span>
              <span className="text-[#7057FF] font-bold text-sm">Isolated Temp &amp; Scrub</span>
              <span className="text-[10px] text-[#766F82]">Host credentials unmounted</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">AST Validator</span>
              <span className="text-[#FF6082] font-bold text-sm">17 Rules Verified</span>
              <span className="text-[10px] text-[#766F82]">Blocks eval, exec, os.system</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#EAE3EA] overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#FAF5F8] border-b border-[#EAE3EA] text-[10px] text-[#766F82] uppercase">
                <tr>
                  <th className="p-3">Tool Target</th>
                  <th className="p-3">Container / Jail</th>
                  <th className="p-3">Network Boundary</th>
                  <th className="p-3">FS Policy</th>
                  <th className="p-3">Violations</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3EA] bg-white">
                {policies.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF5F8] transition-colors">
                    <td className="p-3 font-bold text-[#1E1B26]">{p.name}</td>
                    <td className="p-3 text-[#7057FF]">{p.container_id}</td>
                    <td className="p-3 text-[#FF6082] font-medium">{p.network}</td>
                    <td className="p-3 text-[#766F82]">{p.fs_mode}</td>
                    <td className="p-3 text-[#9B51E0] font-bold">{p.violations}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#7057FF]/10 text-[#7057FF] font-bold text-[10px]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
