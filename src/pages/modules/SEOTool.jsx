import React, { useState } from 'react';
import ToolPage from '../../components/ui/ToolPage';

const SEOTool = () => {
  const [form, setForm] = useState({ keyword: '', url: '', topic: '' });

  const renderForm = (onGenerate, loading) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Target Keyword</label>
        <input
          className="input-field"
          placeholder="e.g. digital marketing automation"
          value={form.keyword}
          onChange={(e) => setForm({ ...form, keyword: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">URL / Topic</label>
        <input
          className="input-field"
          placeholder="e.g. https://example.com or blog topic"
          value={form.url || form.topic}
          onChange={(e) => setForm({ ...form, url: e.target.value, topic: e.target.value })}
        />
      </div>
      <button
        className="btn-primary w-full"
        disabled={loading || !form.keyword}
        onClick={() => onGenerate({ keyword: form.keyword, url: form.url, topic: form.topic })}
      >
        {loading ? 'Generating...' : '🔍 Generate SEO Plan'}
      </button>
    </div>
  );

  const renderOutput = (data) => (
    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Meta Title</p>
        <p className="text-white font-medium">{data.metaTitle}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Meta Description</p>
        <p className="text-gray-300 text-sm">{data.metaDescription}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-2">Blog Outline</p>
        <p className="text-white font-semibold mb-2">{data.blogOutline?.h1}</p>
        {data.blogOutline?.sections?.map((s, i) => (
          <div key={i} className="mb-3">
            <p className="text-brand-400 font-medium text-sm">{s.h2}</p>
            <ul className="mt-1 space-y-0.5">
              {s.points?.map((p, j) => (
                <li key={j} className="text-gray-400 text-sm flex gap-2">
                  <span className="text-gray-600">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data.suggestedInternalLinks?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Internal Link Suggestions</p>
          {data.suggestedInternalLinks.map((l, i) => (
            <p key={i} className="text-brand-400 text-sm">🔗 {l}</p>
          ))}
        </div>
      )}
      {data.focusKeywords?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.focusKeywords.map((k, i) => (
            <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{k}</span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ToolPage
      title="SEO Content Generator"
      icon="🔍"
      module="seo"
      renderForm={renderForm}
      renderOutput={renderOutput}
    />
  );
};

export default SEOTool;
