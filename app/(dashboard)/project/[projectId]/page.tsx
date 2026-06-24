'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { CodeEditor } from '@/components/CodeEditor';

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setProjectId(resolvedParams.projectId);
    }
    getParams();
  }, [params]);

  return (
    <WorkspaceLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Project: {projectId}</h1>
        <p className="text-gray-400">This is your project workspace!</p>
      </div>
      <CodeEditor />
    </WorkspaceLayout>
  );
}
