import React, { useEffect, useState } from 'react';
import Layout from '../components/ui/Layout';
import Spinner from '../components/ui/Spinner';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handlePlanChange = async (userId, plan) => {
    try {
      await adminAPI.updatePlan(userId, plan);
      toast.success(`Plan updated to ${plan}`);
      fetchStats();
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><Spinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-white mb-6">🛡️ Admin Panel</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-4xl font-bold text-brand-400">{stats?.totalUsers}</p>
          <p className="text-gray-400 text-sm mt-1">Total Users</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-green-400">{stats?.totalGenerations}</p>
          <p className="text-gray-400 text-sm mt-1">Total Generations</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">By Module</p>
          {stats?.moduleStats?.map((m) => (
            <div key={m._id} className="flex justify-between text-sm">
              <span className="text-gray-300 capitalize">{m._id}</span>
              <span className="text-brand-400 font-medium">{m.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="card overflow-x-auto">
        <h3 className="text-white font-semibold mb-4">Users</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left pb-3 font-medium">Name</th>
              <th className="text-left pb-3 font-medium">Email</th>
              <th className="text-left pb-3 font-medium">Plan</th>
              <th className="text-left pb-3 font-medium">Usage</th>
              <th className="text-left pb-3 font-medium">Joined</th>
              <th className="text-left pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats?.users?.map((u) => (
              <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 text-white">{u.name}</td>
                <td className="py-3 text-gray-400">{u.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.plan === 'pro' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {u.plan}
                  </span>
                </td>
                <td className="py-3 text-gray-400">{u.usageCount}/{u.quotaLimit}</td>
                <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <select
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
                    value={u.plan}
                    onChange={(e) => handlePlanChange(u._id, e.target.value)}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminPanel;
