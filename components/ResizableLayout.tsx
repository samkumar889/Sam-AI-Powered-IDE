'use client';

import { useState } from 'react';
import { Panel } from 'react-resizable-panels';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  className?: string;
}

export function ResizablePanel({
  children,
  defaultSize = 30,
  minSize = 10,
  maxSize = 100,
  collapsible = false,
  className,
}: ResizablePanelProps) {
  return (
    <Panel
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </Panel>
  );
}
