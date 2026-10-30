import React, { useState } from 'react';

export default function ToolsList({ tools = [], onRefresh, loading }) {
  const [selectedTool, setSelectedTool] = useState(tools[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [execArgs, setExecArgs] = useState('{}');
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [execError, setExecError] = useState(null);

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.target_domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
    setExecResult(null);
    setExecError(null);

    let args = {};
    if (tool.spec?.endpoints?.[0]?.parameters) {
      tool.spec.endpoints[0].parameters.forEach((p) => {
        if (p.default !== null && p.default !== undefined) {
          args[p.name] = p.default;
        } else if (p.required) {
          args[p.name] = p.type === 'integer' || p.type === 'float' ? 0 : p.type === 'boolean' ? true : 'value';
        }
      });
    }
    setExecArgs(JSON.stringify(args, null, 2));
  };

  const handleDelete = async (toolId, toolName) => {
    if (!window.confirm(`Delete tool '${toolName}'?`)) return;
    try {
      await fetch(`/api/tools/${toolId}`, { method: 'DELETE' });
      if (selectedTool?.id === toolId) setSelectedTool(null);
      onRefresh();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  const handleExecute = async () => {
    if (!selectedTool) return;
    setExecuting(true);
    setExecResult(null);
    setExecError(null);

    try {
      let args = {};
      if (execArgs.trim()) args = JSON.parse(execArgs);

      const target = selectedTool.registered_mcp_names?.[0] || selectedTool.name;
      const res = await fetch(`/api/tools/${target}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arguments: args }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Execution failed');
      }
      setExecResult(data);
      onRefresh();
    } catch (err) {
      setExecError(err.message || 'Execution error');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Pane: Installed Tools List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-white border border-brand-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text">
                Installed Tools ({tools.length})
              </span>
              <button
                onClick={onRefresh}
                className="text-xs text-brand-muted hover:text-brand-violet flex items-center gap-1 transition-colors"
              >
                <span className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Refresh</span>
              </button>
            </div>

            {/* Filter */}
            <input
              type="text"
              placeholder="Search tools by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#FAF5F8] border border-brand-border text-xs text-brand-text focus:outline-none focus:border-brand-violet"
            />

            <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
              {filteredTools.length === 0 ? (
                <div className="p-6 text-center text-xs text-brand-muted">
                  No installed tools found.
                </div>
              ) : (
                filteredTools.map((t) => {
                  const isSelected = selectedTool?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTool(t)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FAF5F8] border-brand-violet shadow-sm'
                          : 'bg-white border-brand-border hover:border-brand-violet/40'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold text-xs text-brand-text truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] font-mono text-brand-muted truncate mt-0.5">
                          {t.target_domain || 'api.local'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          {t.state}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id, t.name);
                          }}
                          className="p-1 rounded text-brand-muted hover:text-red-500 transition-colors"
                          title="Delete tool"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Invocation Runner */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {selectedTool ? (
            <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div>
                  <h3 className="font-bold text-sm text-brand-text">{selectedTool.name}</h3>
                  <span className="text-[11px] font-mono text-brand-muted">
                    Function: {selectedTool.registered_mcp_names?.join(', ') || selectedTool.name}
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-[#FAF5F8] border border-brand-border text-brand-muted">
                  {selectedTool.target_domain}
                </span>
              </div>

              {/* Arguments Form */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-text">Arguments (JSON):</label>
                <textarea
                  rows={4}
                  value={execArgs}
                  onChange={(e) => setExecArgs(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#FAF5F8] border border-brand-border text-brand-text font-mono text-xs focus:outline-none focus:border-brand-violet focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="px-4 py-2 rounded-lg bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-brand-violet/25 disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <span className="material-symbols-outlined text-[15px] animate-spin">refresh</span>
                      <span>Running Tool...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                      <span>Run Tool</span>
                    </>
                  )}
                </button>
              </div>

              {execError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {execError}
                </div>
              )}

              {execResult && (
                <div className="rounded-lg bg-[#FAF5F8] border border-brand-border overflow-hidden">
                  <div className="px-3 py-1.5 bg-[#F2ECF2] border-b border-brand-border flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-700 font-semibold">● Output</span>
                    <span className="text-brand-muted">⚡ {execResult.duration_ms || 28}ms</span>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-brand-text overflow-x-auto leading-relaxed">
                    <code>{JSON.stringify(execResult.result || execResult, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-brand-border rounded-xl bg-white text-xs text-brand-muted">
              Select a tool on the left to test or inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
