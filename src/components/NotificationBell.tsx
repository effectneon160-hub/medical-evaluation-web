import React, { useEffect, useState, useRef } from 'react';
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle } from
'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
export const NotificationBell: React.FC = () => {
  const { notifications, currentUserId, markNotificationRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUserId
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
        
        <Bell size={20} />
        {unreadCount > 0 &&
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        }
      </button>

      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.95
          }}
          transition={{
            duration: 0.15
          }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
          
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              {unreadCount > 0 &&
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
            }
            </div>

            <div className="max-h-80 overflow-y-auto">
              {userNotifications.length === 0 ?
            <div className="p-6 text-center text-slate-500 text-sm">
                  No notifications yet
                </div> :

            userNotifications.map((notif) =>
            <div
              key={notif.id}
              className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
              onClick={() => {
                if (!notif.read) markNotificationRead(notif.id);
              }}>
              
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4
                    className={`text-sm ${!notif.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                    
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read &&
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              }
                  </div>
            )
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

};