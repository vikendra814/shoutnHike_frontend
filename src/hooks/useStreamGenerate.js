import { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const useStreamGenerate = () => {
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const generate = async ({ module, provider = 'gemini', input }, onDone) => {
    setStreaming(true);
    setStreamText('');
    setResult(null);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/ai/generate/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ module, provider, input }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Generation failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      abortRef.current = reader;

      let buffer = '';
      let currentEvent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
            continue;
          }
          if (line.startsWith('data: ')) {
            const raw = line.slice(6);
            try {
              const parsed = JSON.parse(raw);
              if (currentEvent === 'chunk' && parsed.text !== undefined) {
                setStreamText((prev) => prev + parsed.text);
              } else if (currentEvent === 'info') {
                setStreamText((prev) => prev + `\n[${parsed.message}]\n`);
              } else if (currentEvent === 'done' && parsed.data !== undefined) {
                setResult(parsed);
                if (onDone) onDone(parsed);
              } else if (currentEvent === 'error') {
                throw new Error(parsed.message || 'Generation failed');
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) throw e;
            }
            currentEvent = '';
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setStreaming(false);
    }
  };

  const abort = () => {
    if (abortRef.current) abortRef.current.cancel();
    setStreaming(false);
  };

  return { generate, streaming, streamText, result, error, abort };
};

export default useStreamGenerate;
