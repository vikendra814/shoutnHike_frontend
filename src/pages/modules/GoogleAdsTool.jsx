import React, { useState } from 'react';
import ToolPage from '../../components/ui/ToolPage';

const GoogleAdsTool = () => {
  const [form, setForm] = useState({ productDescription: '', targetAudience: '' });

  const renderForm = (onGenerate, loading) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Product / Service Description</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Describe your product or service in detail..."
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Target Audience</label>
        <input
          className="input-field"
          placeholder="e.g. Small business owners aged 25-45"
          value={form.targetAudience}
          onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
        />
      </div>
      <button
        className="btn-primary w-full"
        disabled={loading || !form.productDescription || !form.targetAudience}
        onClick={() => onGenerate(form)}
      >
        {loading ? 'Generating...' : '📢 Generate Ad Copy'}
      </button>
    </div>
  );

  const renderOutput = (data) => (
    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
      {data.ads?.map((ad, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4">
          <p className="text-brand-400 font-semibold text-sm mb-3">Variation {ad.variation}</p>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">Headlines</p>
            {ad.headlines?.map((h, j) => (
              <div key={j} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600 w-4">{j + 1}.</span>
                <span className="text-white text-sm">{h}</span>
                <span className={`text-xs ml-auto ${h.length > 30 ? 'text-red-400' : 'text-green-400'}`}>
                  {h.length}/30
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Descriptions</p>
            {ad.descriptions?.map((d, j) => (
              <div key={j} className="flex items-start gap-2 mb-1">
                <span className="text-xs text-gray-600 w-4 mt-0.5">{j + 1}.</span>
                <span className="text-gray-300 text-sm flex-1">{d}</span>
                <span className={`text-xs ml-2 flex-shrink-0 ${d.length > 90 ? 'text-red-400' : 'text-green-400'}`}>
                  {d.length}/90
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ToolPage
      title="Google Ads Copy"
      icon="📢"
      module="google-ads"
      renderForm={renderForm}
      renderOutput={renderOutput}
    />
  );
};

export default GoogleAdsTool;
