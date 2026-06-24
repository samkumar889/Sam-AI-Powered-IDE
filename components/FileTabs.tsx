'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  path: string;
  modified: boolean;
  active: boolean;
}

interface FileTabsProps {
  tabs: Tab[];
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
}

export default function FileTabs({ tabs, onTabClick, onTabClose }: FileTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-sidebar border-b border-border overflow-x-auto">
      <AnimatePresence mode="popLayout">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-l border-r transition-colors group min-w-[120px] max-w-[200px]",
              tab.active
                ? "bg-background border-border text-text-primary"
                : "bg-sidebar border-transparent text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
            )}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <button
              onClick={() => onTabClick(tab.id)}
              className="flex-1 flex items-center gap-2 min-w-0"
            >
              <span className="text-sm truncate">{tab.title}</span>
              {tab.modified && (
                <Circle size={6} className="text-accent flex-shrink-0 fill-accent" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className={cn(
                "p-0.5 rounded transition-colors",
                hoveredTab === tab.id || tab.active
                  ? "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover opacity-100"
                  : "opacity-0"
              )}
            >
              <X size={12} />
            </button>

            {tab.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
