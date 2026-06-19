import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';
import useAuthStore from '../store/authStore';

const TYPE_LABELS = {
  REPORT_CREATED: 'Nuevo reporte',
  STATUS_CHANGED: 'Cambio de estado',
  REOPEN_REQUESTED: 'Reapertura solicitada',
};

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

const MUNICIPAL_ROLES = ['MUNICIPAL_OFFICER', 'ADMIN_MUNICIPAL', 'SUPER_ADMIN'];

export default function NotificationDropdown({ open, onClose, dropUp = false, alignLeft = false }) {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();
  const { user } = useAuthStore();
  const ref = useRef(null);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  if (!open) return null;

  const getLink = (n) => {
    if (!n.reportId) return null;
    if (MUNICIPAL_ROLES.includes(user?.roleName)) return `/municipal/gestion/${n.reportId}`;
    return null;
  };

  const NotifContent = ({ n }) => (
    <div className="flex items-start gap-2">
      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#0050A5]' : 'bg-transparent'}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-[#424752] uppercase tracking-wide">
          {TYPE_LABELS[n.type] || n.type}
        </p>
        <p className="text-sm font-medium text-[#1b1c1c] leading-snug">{n.title}</p>
        <p className="text-xs text-[#424752] mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[10px] text-[#9ca3af] mt-1">{timeAgo(n.createdAt)}</p>
      </div>
    </div>
  );

  const itemClass = (n) =>
    `w-full text-left px-4 py-3 border-b border-[#f5f3f3] hover:bg-[#f5f3f3] transition-colors block ${
      !n.read ? 'bg-[#EEF4FF]' : ''
    }`;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className={`absolute w-80 bg-white rounded-xl shadow-xl border border-[#e4e2e2] z-50 overflow-hidden ${
          dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
        } ${alignLeft ? 'left-0' : 'right-0'}`}
      >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f5f3f3]">
        <span className="font-headline font-bold text-sm text-[#1b1c1c]">
          Notificaciones {unreadCount > 0 && <span className="text-[#0050A5]">({unreadCount})</span>}
        </span>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-[#0050A5] hover:underline font-medium">
            Marcar todas
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading && <p className="text-center text-sm text-[#424752] py-6">Cargando...</p>}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-2 text-[#424752]">
            <span className="material-symbols-outlined text-3xl">notifications_off</span>
            <p className="text-sm">Sin notificaciones</p>
          </div>
        )}

        {!loading && notifications.map((n) => {
          const link = getLink(n);
          const handleClick = () => { if (!n.read) markAsRead(n.notificationId); onClose(); };

          return link ? (
            <Link
              key={n.notificationId}
              to={link}
              onClick={handleClick}
              className={itemClass(n)}
            >
              <NotifContent n={n} />
            </Link>
          ) : (
            <button
              key={n.notificationId}
              onClick={handleClick}
              className={itemClass(n)}
            >
              <NotifContent n={n} />
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
}
