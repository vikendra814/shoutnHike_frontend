import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/ui/Layout';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const tools = [
  {
    to: '/tools/social-media',
    label: 'Social Media Posts',
    desc: 'Generate LinkedIn, Instagram & Twitter posts from a brand brief.',
    icon: '📱',
    color: 'from-blue-500/20 to-purple-500/20 border-blue-500/30',
  },
  {
    to: '/tools/seo',
    label: 'SEO Content',
    desc: 'Blog outlines, meta titles, descriptions & internal link suggestions.',
    icon: '🔍',
    color: 'from-green-500/20 to-teal-500/20 border-green-500/30',
  },
  {
    to: '/tools/google-ads',
    label: 'Google Ads Copy',
    desc: 'Generate 3 RSA variations with headlines & descriptions.',
    icon: '📢',
    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  },
  {
    to: '/tools/design-brief',
    label: 'Design Brief',
    desc: 'Structured creative briefs with visual direction & CTA suggestions.',
    icon: '🎨',
    color: 'from-pink-500/20 to-red-500/20 border-pink-500/30',
  },
];

const Dashboard = () => {
  const { user, updateUsage } = useAuth();
  const remaining = user ? user.quotaLimit - user.usageCount : 0;

  const handleUpgrade = async () => {
    try {
      const res = await userAPI.upgrade();
      updateUsage({ plan: res.data.data.plan, quotaLimit: res.data.data.quotaLimit });
      toast.success('Upgraded to Pro! 🎉');
    } catch {
      toast.error('Upgrade failed');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-gray-400 mt-1">Choose a tool to start generating AI-powered marketing content.</p>
      </div>

      {/* Quota banner */}
      {remaining <= 2 && user?.plan === 'free' && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
          <p className="text-yellow-300 text-sm">
            ⚠️ You have <strong>{remaining}</strong> generation{remaining !== 1 ? 's' : ''} left on the free plan.
          </p>
          <button onClick={handleUpgrade} className="btn-primary text-sm py-1.5 px-4">
            Upgrade to Pro
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`card bg-gradient-to-br ${t.color} border hover:scale-[1.02] transition-transform`}
          >
            <div className="text-3xl mb-3">{t.icon}</div>
            <h3 className="text-white font-semibold text-lg">{t.label}</h3>
            <p className="text-gray-400 text-sm mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 card flex items-center justify-between">
        <div>
          <p className="text-white font-medium">
            Plan: <span className="text-brand-400 capitalize">{user?.plan}</span>
          </p>
          <p className="text-gray-400 text-sm mt-0.5">
            {user?.usageCount} / {user?.quotaLimit} generations used
          </p>
        </div>
        {user?.plan === 'free' && (
          <button onClick={handleUpgrade} className="btn-primary">
            Upgrade to Pro ⭐
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
