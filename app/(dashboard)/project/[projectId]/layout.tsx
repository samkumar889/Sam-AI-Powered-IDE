import React from 'react';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full">{children}</div>;
}
