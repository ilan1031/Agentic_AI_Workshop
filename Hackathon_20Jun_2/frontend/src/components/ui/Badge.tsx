import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', className = '' }) => (
  <span className={`badge bg-${variant} ${className}`.trim()}>{children}</span>
);

export default Badge;