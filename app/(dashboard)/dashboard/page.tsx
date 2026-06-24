'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { CodeEditor } from '@/components/CodeEditor';

export default function DashboardPage() {
  return (
    <WorkspaceLayout>
      <CodeEditor />
    </WorkspaceLayout>
  );
}
