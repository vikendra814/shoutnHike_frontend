import React, { useState } from 'react';
import ToolPage from '../../components/ui/ToolPage';

const DesignBriefTool = () => {
  const [form, setForm] = useState({ campaignGoal: '', brandColors: '', brandTone: '' });

  const renderForm = (onGenerate, loading) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Campaign Goal</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="e.g. Launch a new SaaS product targeting startup founders"
          value={form.campaignGoal}
          onChange={(e) => setForm({ ...form, campaignGoal: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Brand Colors</label>
        <input
          className="input-field"
          placeholder="e.g. Navy blue #1a2d9e, White #ffffff, Gold #f5c518"
          value={form.brandColors}
          onChange={(e) => setForm({ ...form, brandColors: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Brand Tone</label>
        <input
          className="input-field"
          placeholder="e.g. Bold, modern, trustworthy"
          value={form.brandTone}
          onChange={(e) => setForm({ ...form, brandTone: e.target.value })}
        />
      </div>
      <button
        className="btn-primary w-full"
        disabled={loading || !form.campaignGoal}
        onClick={() => onGenerate(form)}
      >
        {loading ? 'Generating...' : '🎨 Generate Design Brief'}
      </button>
    </div>
  );

  const renderOutput = (data) => (
    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
      {[
        { label: 'Headline', value: data.headline, big: true },
        { label: 'Subheadline', value: data.subheadline },
        { label: 'Visual Direction', value: data.visualDirection },
        { label: 'Color Usage', value: data.colorUsage },
        { label: 'Copy Direction', value: data.copyDirection },
        { label: 'Canva Template', value: data.canvaTemplate },
      ].map(({ label, value, big }) => (
        <div key={label} className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`${big ? 'text-white font-semibold text-lg' : 'text-gray-300 text-sm'}`}>{value}</p>
        </div>
      ))}
      {data.ctaSuggestions?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">CTA Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {data.ctaSuggestions.map((cta, i) => (
              <span key={i} className="bg-brand-500/20 text-brand-300 text-sm px-3 py-1 rounded-full border border-brand-500/30">
                {cta}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolPage
      title="Design Brief Generator"
      icon="🎨"
      module="design-brief"
      renderForm={renderForm}
      renderOutput={renderOutput}
    />
  );
};

export default DesignBriefTool;
