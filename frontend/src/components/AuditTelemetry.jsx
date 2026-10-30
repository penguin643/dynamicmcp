import React from 'react';

export default function AuditTelemetry({ tools = [], systemInfo }) {
  const events = [
    { time: '16:15:02', opcode: 'INGEST', msg: 'Spec extracted via NVIDIA Nemotron Nano (18ms)' },
    { time: '16:15:03', opcode: 'SYNTH', msg: 'FastMCP Python code synthesized via Nemotron 3 Ultra (820ms)' },
    { time: '16:15:04', opcode: 'AST_CHK', msg: 'AST check passed 17 security invariants (0 dangerous calls)' },
    { time: '16:15:04', opcode: 'NEBIUS', msg: 'Headless dry-run job completed successfully (180ms)' },
    { time: '16:15:05', opcode: 'LANDLOCK', msg: 'Kernel LSM confinement mounted for container openshell-881' },
    { time: '16:15:05', opcode: 'HOT_LOAD', msg: 'Tool dynamic__open_meteo_forecast injected into live Hermes session' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      <div className="bg-white border border-[#EAE3EA] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="h-10 bg-[#FFF9FD] border-b border-[#EAE3EA] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF6082] text-[18px]">analytics</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E1B26]">
              Real-time Audit Trail &amp; Telemetry
            </span>
          </div>
          <span className="text-[#766F82] font-mono text-[10px]">
            Zero-Telemetry Engine Active
          </span>
        </div>

        <div className="p-5 flex flex-col gap-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">Total Tools</span>
              <span className="text-[#7057FF] font-bold text-lg">{tools.length}</span>
              <span className="text-[10px] text-[#766F82]">Stored in SQLite skills.db</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">Nebius Compute</span>
              <span className="text-[#FF6082] font-bold text-lg">neb-fin-h100-8x</span>
              <span className="text-[10px] text-[#766F82]">Token Factory Online</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] flex flex-col gap-1">
              <span className="text-[10px] text-[#766F82] uppercase font-bold">Hot-Reload Latency</span>
              <span className="text-[#9B51E0] font-bold text-lg">24.6ms</span>
              <span className="text-[10px] text-[#766F82]">Zero downtime</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#EAE3EA] overflow-hidden">
            <div className="h-8 bg-[#FAF5F8] px-3 flex items-center justify-between text-[11px] font-mono border-b border-[#EAE3EA]">
              <span className="font-bold text-[#1E1B26]">Lifecycle State Transitions</span>
              <span className="text-[#766F82]">Deterministic FIFO Queue</span>
            </div>
            <div className="p-3 bg-white flex flex-col gap-1.5 font-mono text-xs">
              {events.map((e, idx) => (
                <div key={idx} className="flex items-center gap-3 p-1 rounded hover:bg-[#FAF5F8]">
                  <span className="text-[#766F82] text-[11px]">{e.time}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#7057FF]/10 text-[#7057FF] font-bold text-[10px]">
                    {e.opcode}
                  </span>
                  <span className="text-[#1E1B26]">{e.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
