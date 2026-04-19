import React, { useState } from 'react';
import ToolPage from '../../components/ui/ToolPage';

const defaultTopics = ['Product Launch', 'Customer Success Story', 'Industry Tip', 'Behind the Scenes'];

const SocialMediaTool = () => {
  const [form, setForm] = useState({
    brandName: '',
    brandBrief: '',
    tone: 'professional',
    topics: defaultTopics.join('\n'),
  });

  const renderForm = (onGenerate, loading) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Brand Name</label>
        <input
          className="input-field"
          placeholder="e.g. ShoutnHike"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Brand Brief</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Describe your brand, products, and target audience..."
          value={form.brandBrief}
          onChange={(e) => setForm({ ...form, brandBrief: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Tone</label>
        <select
          className="input-field"
          value={form.tone}
          onChange={(e) => setForm({ ...form, tone: e.target.value })}
        >
          {['professional', 'casual', 'witty', 'inspirational', 'educational'].map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Weekly Topics (one per line)</label>
        <textarea
          className="input-field resize-none font-mono text-sm"
          rows={5}
          value={form.topics}
          onChange={(e) => setForm({ ...form, topics: e.target.value })}
        />
      </div>
      <button
        className="btn-primary w-full"
        disabled={loading || !form.brandName || !form.brandBrief}
        onClick={() =>
          onGenerate({
            brandName: form.brandName,
            brandBrief: form.brandBrief,
            tone: form.tone,
            topics: form.topics.split('\n').filter(Boolean),
          })
        }
      >
        {loading ? 'Generating...' : '✨ Generate Posts'}
      </button>
    </div>
  );

  const renderOutput = (data) => (
    <div className="space-y-6 overflow-y-auto max-h-[600px] pr-1">
      {data.posts?.map((post, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h4 className="text-brand-400 font-semibold text-sm uppercase tracking-wide">{post.topic}</h4>

          {[
            { platform: 'LinkedIn', key: 'linkedin', emoji: '💼' },
            { platform: 'Instagram', key: 'instagram', emoji: '📸' },
            { platform: 'Twitter/X', key: 'twitter', emoji: '🐦' },
          ].map(({ platform, key, emoji }) => (
            <div key={key} className="bg-gray-900 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">{emoji} {platform}</p>
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{post[key]?.copy}</p>
              {post[key]?.hashtags?.length > 0 && (
                <p className="text-brand-400 text-xs mt-1">{post[key].hashtags.map((h) => `#${h}`).join(' ')}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <ToolPage
      title="Social Media Posts"
      icon="📱"
      module="social-media"
      renderForm={renderForm}
      renderOutput={renderOutput}
    />
  );
};

export default SocialMediaTool;
