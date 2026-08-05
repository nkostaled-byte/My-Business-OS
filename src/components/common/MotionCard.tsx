import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  enableHover?: boolean;
  delay?: number;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  enableHover = true,
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        enableHover
          ? {
              y: -2,
              boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px -6px rgba(15,23,42,0.12)',
            }
          : undefined
      }
      className={`glass-panel rounded-xl transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
