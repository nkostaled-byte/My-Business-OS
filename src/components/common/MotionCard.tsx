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
              y: -3,
              boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.04)',
            }
          : undefined
      }
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
