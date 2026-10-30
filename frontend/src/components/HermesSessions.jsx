import React from 'react';

export default function HermesSessions({ tools = [] }) {
  const sessions = [
    {
      id: 'session-nemotron-live-092',
      agent: 'Hermes Orchestrator (Personal AI)',
      ipc_socket: '/run/dynamic-mcp/hermes.sock',
      tools_attached: tools.length,
      status: 'ACTIVE_INTERACTIVE',
      last_activity: '12 seconds ago',
    },
    {
      id: 'session-hermes-worker-014',
      agent: 'Hermes Automated Test Runner',
      ipc_socket: '/tmp/hermes-worker.sock',
      tools_attached: tools.length,
      status: 'IDLE_LISTENING',
      last_activity: '2 minutes ago',
    },
    {
      id: 'session-hermes-agent-381',
      agent: 'Personal Workflow Assistant',
      ipc_socket: '/tmp/hermes-personal.sock',
      tools_attached: tools.length,
      status: 'DISPATCHING',
      last_activity: 'Just now',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      <div className="bg-white border border-[#EAE3EA] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="h-10 bg-[#FFF9FD] border-b border-[#EAE3EA] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7057FF] text-[18px]">hub</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E1B26]">
              Hermes Agent Integration &amp; Dynamic Tool Sessions (3 ACT)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#7057FF]/10 text-[#7057FF] font-mono text-[10px] font-bold">
            ZERO-DAEMON RESTART
          </span>
        </div>

        <div className="p-5 flex flex-col gap-4 font-mono text-xs">
          <div className="rounded-lg bg-[#FAF5F8] border border-[#EAE3EA] p-4 text-[#766F82] leading-relaxed">
            DynamicMCP communicates with active Hermes Agent runtime sessions using FastMCP protocol IPC sockets.
            When an unfamiliar action or API command is encountered, DynamicMCP synthesizes, verifies in Nebius Serverless, and hot-registers the tool into live agent memory without resetting conversational state.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white border border-[#EAE3EA] rounded-lg p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6082] animate-pulse"></span>
                    <span className="font-bold text-xs text-[#1E1B26]">{s.id}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[9px]">
                    {s.status}
                  </span>
                </div>

                <div className="text-xs flex flex-col gap-1 text-[#766F82] mt-1">
                  <div><strong className="text-[#1E1B26]">Harness:</strong> {s.agent}</div>
                  <div><strong className="text-[#1E1B26]">IPC Socket:</strong> {s.ipc_socket}</div>
                  <div><strong className="text-[#1E1B26]">Tools Mounted:</strong> <span className="text-[#FF6082] font-bold">{s.tools_attached}</span></div>
                  <div><strong className="text-[#1E1B26]">Activity:</strong> {s.last_activity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
