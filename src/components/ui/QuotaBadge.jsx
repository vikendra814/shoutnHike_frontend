import React from 'react';
import { useAuth } from '../../context/AuthContext';

const QuotaBadge = () => {
  const { user } = useAuth();
  if (!user) return null;

  const pct = Math.round((user.usageCount / user.quotaLimit) * 100);
  const remaining = user.quotaLimit - user.usageCount;
  const color = remaining === 0 ? 'bg-red-500' : remaining <= 2 ? 'bg-yellow-500' : 'bg-brand-500';

  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{user.plan === 'pro' ? '⭐ Pro' : '🆓 Free'}</span>
        <span>{remaining} left</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default QuotaBadge;
