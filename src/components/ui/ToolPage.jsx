import React, { useState } from 'react';
import Layout from '../../components/ui/Layout';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import useStreamGenerate from '../../hooks/useStreamGenerate';
import { exportTxt, exportDocx } from '../../services/exportService';
import toast from 'react-hot-toast';

const ProviderToggle = ({ value, onChange }) => (
  <div className="flex gap-2">
    {['gemini', 'openai'].map((p) => (
      <button
        key={p}
        onClick={() => onChange(p)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          value === p ? 'bg-brand-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        {p === 'gemini' ? '✨ Gemini' : '🤖 GPT-4o'}
      </button>
    ))}
  </div>
);

const ToolPage = ({ title, icon, module, renderForm, renderOutput }) => {
  const [provider, setProvider] = useState('gemini');
  const { streaming, streamText, result, error, generate } = useStreamGenerate();
  const { updateUsage } = useAuth();

  const handleGenerate = (input) => {
    generate({ module, provider, input }, (done) => {
      if (done?.usage) updateUsage({ usageCount: done.usage.used, quotaLimit: done.usage.limit });
      toast.success('Generated successfully!');
    });
  };

  const outputData = result?.data;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {icon} {title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">Powered by dual AI providers</p>
        </div>
        <ProviderToggle value={provider} onChange={setProvider} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Input</h3>
          {renderForm(handleGenerate, streaming)}
        </div>

        {/* Output panel */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Output</h3>
            {outputData && (
              <div className="flex gap-2">
                <button
                  onClick={() => exportTxt(outputData, `${module}-output.txt`)}
                  className="text-xs btn-secondary py-1 px-3"
                >
                  .txt
                </button>
                <button
                  onClick={() => exportDocx(outputData, `${module}-output.docx`)}
                  className="text-xs btn-secondary py-1 px-3"
                >
                  .docx
                </button>
              </div>
            )}
          </div>

          {streaming && !outputData && (
            <div className="flex-1">
              <div className="flex items-center gap-2 text-brand-400 mb-3">
                <Spinner size="sm" />
                <span className="text-sm">Generating with {provider === 'gemini' ? 'Gemini' : 'GPT-4o'}...</span>
              </div>
              <pre className={`text-gray-300 text-xs whitespace-pre-wrap font-mono bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto ${streaming ? 'streaming-cursor' : ''}`}>
                {streamText || ' '}
              </pre>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {outputData && !streaming && renderOutput(outputData)}

          {!streaming && !outputData && !error && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Fill in the form and click Generate
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ToolPage;
