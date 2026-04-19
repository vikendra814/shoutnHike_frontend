import React, { useEffect, useState } from 'react';
import Layout from '../components/ui/Layout';
import Spinner from '../components/ui/Spinner';
import { historyAPI } from '../services/api';
import { exportTxt, exportDocx } from '../services/exportService';
import toast from 'react-hot-toast';

const MODULE_LABELS = {
  'social-media': '📱 Social Media',
  seo: '🔍 SEO',
  'google-ads': '📢 Google Ads',
  'design-brief': '🎨 Design Brief',
};

const renderValue = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val !== 'object') return <span className="text-gray-200 text-sm">{String(val)}</span>;

  if (Array.isArray(val)) {
    // Array of primitives (hashtags, keywords, CTAs etc.)
    if (val.length === 0) return null;
    if (typeof val[0] !== 'object') {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {val.map((item, i) => (
            <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">{item}</span>
          ))}
        </div>
      );
    }
    // Array of objects (posts, ads, sections etc.)
    return (
      <div className="space-y-3 mt-1">
        {val.map((item, i) => (
          <div key={i} className="bg-gray-900 rounded-lg p-3 space-y-2">
            {Object.entries(item).map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                {renderValue(v)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Plain object
  return (
    <div className="space-y-2 mt-1">
      {Object.entries(val).map(([k, v]) => (
        <div key={k}>
          <p className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
          {renderValue(v)}
        </div>
      ))}
    </div>
  );
};

const renderFormattedOutput = (output) => {
  if (!output || typeof output !== 'object') {
    return <p className="text-gray-300 text-sm">{String(output)}</p>;
  }
  if (output.raw) {
    return <pre className="text-gray-300 text-xs whitespace-pre-wrap">{output.raw}</pre>;
  }
  return Object.entries(output).map(([key, val]) => (
    <div key={key} className="border-b border-gray-700 pb-3 last:border-0">
      <p className="text-xs font-medium text-brand-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
      {renderValue(val)}
    </div>
  ));
};

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [moduleFilter, setModuleFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await historyAPI.getAll({ page, limit: 10, module: moduleFilter || undefined });
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [page, moduleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    try {
      await historyAPI.delete(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">Generation History</h2>
        <select
          className="input-field w-auto"
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Modules</option>
          {Object.entries(MODULE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : items.length === 0 ? (
            <div className="card text-center text-gray-500 py-12">No generations yet. Start creating!</div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                className={`card cursor-pointer hover:border-brand-500/50 transition-colors ${
                  selected?._id === item._id ? 'border-brand-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm">{MODULE_LABELS[item.module]}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.provider === 'gemini' ? '✨ Gemini' : '🤖 GPT-4o'} •{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 truncate">
                      {JSON.stringify(item.input).slice(0, 80)}...
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xs flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex gap-2 justify-center pt-2">
              <button
                className="btn-secondary text-sm py-1.5 px-3"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="text-gray-400 text-sm py-1.5 px-2">
                {page} / {pagination.pages}
              </span>
              <button
                className="btn-secondary text-sm py-1.5 px-3"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="card">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{MODULE_LABELS[selected.module]}</h3>
                <button
                  onClick={() => exportTxt(selected.output, `${selected.module}-${selected._id}.txt`)}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  .txt
                </button>
                <button
                  onClick={() => exportDocx(selected.output, `${selected.module}-${selected._id}.docx`)}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  .docx
                </button>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Input</p>
                <pre className="text-gray-400 text-xs bg-gray-800 rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(selected.input, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Output</p>
                <div className="bg-gray-800 rounded-lg p-3 overflow-y-auto max-h-80 space-y-2">
                  {renderFormattedOutput(selected.output)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm py-12">
              Select a generation to view details
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
