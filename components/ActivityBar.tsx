'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Folder, 
  Search, 
  Settings, 
  GitBranch,
  Sparkles,
  Layout,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityBarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView: 'chat' | 'files' | 'search' | 'git' | 'settings';
  onViewChange: (view: 'chat' | 'files' | 'search' | 'git' | 'settings') => void;
}

export default function ActivityBar({ 
  isCollapsed, 
  onToggleCollapse, 
  activeView, 
  onViewChange 
}: ActivityBarProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const activities = [
    { id: 'chat', icon: Sparkles, label: 'AI Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Git' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col items-center py-3 bg-sidebar border-r border-border h-full">
      {/* Collapse Toggle */}
      <motion.button
        onClick={onToggleCollapse}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors mb-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </motion.button>

      {/* Activity Icons */}
      <div className="flex flex-col gap-2 flex-1">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isActive = activeView === activity.id;
          const isHovered = hoveredIcon === activity.id;

          return (
            <motion.button
              key={activity.id}
              onClick={() => onViewChange(activity.id as any)}
              onMouseEnter={() => setHoveredIcon(activity.id)}
              onMouseLeave={() => setHoveredIcon(null)}
              className={cn(
            "relative p-3 rounded-lg transition-all duration-200",
            isActive 
              ? "bg-red-900/50 text-red-400" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
          )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={{
                width: isCollapsed ? 'auto' : 'auto',
              }}
            >
              <Icon size={20} />
              
              {/* Tooltip */}
              {isCollapsed && isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-2 px-2 py-1 bg-panel border border-border rounded-md text-xs text-text-primary whitespace-nowrap z-50"
                >
                  {activity.label}
                </motion.div>
              )}

              {/* Active Indicator */}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <motion.button
          className="p-3 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Layout"
        >
          <Layout size={20} />
        </motion.button>
      </div>
    </div>
  );
}
