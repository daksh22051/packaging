import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  Truck,
  Leaf,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead, triggerToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE6]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Platform Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Algorithmic match notifications, consignment dispatches, and circular telemetry milestones.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            markAllNotificationsRead();
            triggerToast('Notifications Marked', 'All notifications marked as read.');
          }}
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
        >
          Mark all as read
        </Button>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => item.link && navigate(item.link)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                item.read
                  ? 'bg-white border-[#E2EAE4] hover:border-[#BED0C3]'
                  : 'bg-[#F4F8F5] border-emerald-300/80 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'match'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.type === 'transaction'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                {item.type === 'match' && <Sparkles className="w-5 h-5" />}
                {item.type === 'transaction' && <Truck className="w-5 h-5" />}
                {item.type === 'impact' && <Leaf className="w-5 h-5" />}
                {item.type === 'system' && <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#182620]">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#6A7C72] shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#526359] mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16382C] mt-2 hover:underline">
                    <span>View details</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="All caught up!"
          description="You have no notifications pending review."
        />
      )}
    </div>
  );
};
