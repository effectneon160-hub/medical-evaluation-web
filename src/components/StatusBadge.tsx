import React from 'react';
import { RequestStatus } from '../types';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  AlertCircle } from
'lucide-react';
interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md'
}) => {
  const config = {
    draft: {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: FileEdit,
      label: 'Draft'
    },
    pending: {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      label: 'Pending Review'
    },
    under_review: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertCircle,
      label: 'Under Review'
    },
    approved: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle,
      label: 'Approved'
    },
    denied: {
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle,
      label: 'Denied'
    }
  };
  const { color, icon: Icon, label } = config[status];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${color} ${sizeClasses[size]}`}>
      
      <Icon size={iconSizes[size]} />
      {label}
    </span>);

};