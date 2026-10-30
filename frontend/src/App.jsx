import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Playground from './components/Playground';
import ToolsList from './components/ToolsList';
import SecurityMatrix from './components/SecurityMatrix';
import AuditTelemetry from './components/AuditTelemetry';
import HermesSessions from './components/HermesSessions';

export default function App() {
  const [activeTab, setActiveTab] = useState('assembly-studio');
  const [tools, setTools] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [selectedToolDetail, setSelectedToolDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchState = async () => {
    setLoading(true);
    try {
      const [toolsRes, sysRes] = await Promise.all([
        fetch('/api/tools'),
        fetch('/api/system'),
      ]);

      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        setTools(toolsData);
        if (toolsData.length > 0 && !selectedToolDetail) {
          fetchToolDetail(toolsData[0].name || toolsData[0].id);
        }
      }
      if (sysRes.ok) setSystemInfo(await sysRes.json());
    } catch (err) {
      console.error('Failed to sync backend state:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchToolDetail = async (toolName) => {
    try {
      const res = await fetch(`/api/tools/${toolName}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedToolDetail(data);
      }
    } catch (e) {
      console.error('Failed to fetch tool detail:', e);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5F8] text-[#1E1B26] flex flex-col font-sans selection:bg-[#7057FF] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toolsCount={tools.length}
        onRefresh={fetchState}
        loading={loading}
      />

      {/* Main Workbench Body */}
      <main className="flex-1 pb-10">
        {activeTab === 'assembly-studio' && (
          <Playground
            activeToolDetail={selectedToolDetail}
            onToolCreated={fetchState}
            onSelectTool={fetchToolDetail}
          />
        )}

        {activeTab === 'installed-tools' && (
          <ToolsList
            tools={tools}
            onRefresh={fetchState}
            loading={loading}
          />
        )}

        {activeTab === 'security-sandboxes' && (
          <SecurityMatrix
            tools={tools}
          />
        )}

        {activeTab === 'audit-telemetry' && (
          <AuditTelemetry
            tools={tools}
            systemInfo={systemInfo}
          />
        )}

        {activeTab === 'hermes-agent-sessions' && (
          <HermesSessions
            tools={tools}
          />
        )}
      </main>

      {/* Minimal System Telemetry Strip */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#EAE3EA] py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#766F82]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-[#9B51E0]">database</span>
              <span>SkillStore: <strong className="text-[#1E1B26]">sqlite3://skills.db (WAL)</strong></span>
            </span>
            <span className="hidden sm:inline text-[#EAE3EA]">|</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-[#7057FF]">hub</span>
              <span>Compute: <strong className="text-[#1E1B26]">node-h100-sxm5-04b</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Zero-Telemetry Active</span>
            </span>
            <span className="hidden sm:inline text-[#EAE3EA]">|</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-[#FF6082]">cable</span>
              <span>IPC Socket: <strong className="text-[#1E1B26]">/run/dynamic-mcp/hermes.sock</strong></span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
