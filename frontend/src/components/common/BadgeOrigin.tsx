import React from 'react';
import { ProvenanceBadge, ProvenanceType } from '@/components/ui/ProvenanceBadge';

interface BadgeOriginProps {
  origin: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BadgeOrigin: React.FC<BadgeOriginProps> = ({ origin, size = 'sm', className = '' }) => {
  return <ProvenanceBadge origin={origin} size={size} className={className} />;
};
