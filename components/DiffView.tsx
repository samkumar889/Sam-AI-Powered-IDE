export interface DiffViewProps {
  originalContent?: string;
  newContent: string;
  type: 'create' | 'modify' | 'delete';
}

export default function DiffView({ originalContent, newContent, type }: DiffViewProps) {
  const renderDiff = () => {
    if (type === 'create') {
      return (
        <div className="p-4">
          <h4 className="text-green-400 font-semibold mb-2">New File</h4>
          <pre className="text-xs bg-green-900/20 text-green-100 p-2 rounded overflow-auto max-h-60">
            {newContent}
          </pre>
        </div>
      );
    }

    if (type === 'delete') {
      return (
        <div className="p-4">
          <h4 className="text-red-400 font-semibold mb-2">File to Delete</h4>
          <pre className="text-xs bg-red-900/20 text-red-100 p-2 rounded overflow-auto max-h-60">
            {originalContent}
          </pre>
        </div>
      );
    }

    // Simple line-by-line diff for modify
    const originalLines = originalContent?.split('\n') || [];
    const newLines = newContent.split('\n');
    const maxLength = Math.max(originalLines.length, newLines.length);

    const diffLines = [];
    for (let i = 0; i < maxLength; i++) {
      const oldLine = originalLines[i];
      const newLine = newLines[i];
      
      if (oldLine === newLine) {
        diffLines.push(
          <div key={i} className="text-gray-400 text-xs pl-4">
            {oldLine}
          </div>
        );
      } else {
        if (oldLine !== undefined) {
          diffLines.push(
            <div key={`del-${i}`} className="text-red-400 text-xs pl-2 bg-red-900/20">
              - {oldLine}
            </div>
          );
        }
        if (newLine !== undefined) {
          diffLines.push(
            <div key={`add-${i}`} className="text-green-400 text-xs pl-2 bg-green-900/20">
              + {newLine}
            </div>
          );
        }
      }
    }

    return (
      <div className="p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">Modified</h4>
        <div className="font-mono text-xs overflow-auto max-h-60 bg-black/40 rounded p-2">
          {diffLines}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {renderDiff()}
    </div>
  );
}