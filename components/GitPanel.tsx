
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GitBranch, GitCommit, Download, Upload, Plus, History, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function GitPanel() {
  const { fileTree, folderHandle } = useAppStore();
  
  const [commitMessage, setCommitMessage] = useState('');
  const [branchName, setBranchName] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const [currentBranch, setCurrentBranch] = useState<string>('');
  const [branches, setBranches] = useState<string[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Get the project directory - assuming first folder is the project root
  const getProjectDir = useCallback(() => {
    if (folderHandle && 'name' in folderHandle) {
      // We need the actual file system path, but for browser File System Access API
      // we don't have direct path access. We'll need to handle this differently.
      // For now, we'll use a placeholder or assume the user has set it.
      return null;
    }
    
    // Fallback to initial file tree root
    if (fileTree.length > 0) {
      return fileTree[0].path;
    }
    
    return null;
  }, [fileTree, folderHandle]);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setError('');
    } else {
      setError(msg);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  const refreshGit = useCallback(async () => {
    const dir = getProjectDir();
    if (!dir) return;
    
    setIsRefreshing(true);
    try {
      // Get current branch
      const branchRes = await fetch('/api/git/current-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (branchRes.ok) {
        const data = await branchRes.json();
        setCurrentBranch(data.branch || '');
      }
      
      // Get branches
      const branchesRes = await fetch('/api/git/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (branchesRes.ok) {
        const data = await branchesRes.json();
        setBranches(data.branches?.all || []);
      }
      
      // Get status
      const statusRes = await fetch('/api/git/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatus(data.status || []);
      }
      
      // Get log
      const logRes = await fetch('/api/git/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (logRes.ok) {
        const data = await logRes.json();
        setCommits(data.commits || []);
      }
    } catch (err) {
      console.error('Refresh git error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [getProjectDir]);

  useEffect(() => {
    refreshGit();
  }, [refreshGit]);

  const handleInit = async () => {
    const dir = getProjectDir();
    if (!dir) {
      showMessage('No project directory selected', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/git/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir, defaultBranch: 'main' }),
      });
      if (res.ok) {
        showMessage('Git repository initialized!', 'success');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to initialize git', 'error');
    }
  };

  const handleCreateBranch = async () => {
    const dir = getProjectDir();
    if (!dir || !branchName) return;
    
    setIsCreatingBranch(true);
    try {
      const res = await fetch('/api/git/create-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir, ref: branchName, checkout: true }),
      });
      if (res.ok) {
        showMessage(`Branch ${branchName} created!`, 'success');
        setBranchName('');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to create branch', 'error');
    } finally {
      setIsCreatingBranch(false);
    }
  };

  const handleCheckout = async (ref: string) => {
    const dir = getProjectDir();
    if (!dir) return;
    
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/git/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir, ref }),
      });
      if (res.ok) {
        showMessage(`Checked out ${ref}!`, 'success');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to checkout branch', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCommit = async () => {
    const dir = getProjectDir();
    if (!dir || !commitMessage) return;
    
    setIsCommitting(true);
    try {
      // Add all files first
      await fetch('/api/git/add-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dir, 
          message: commitMessage,
          author: { name: 'User', email: 'user@example.com' }
        }),
      });
      if (res.ok) {
        showMessage('Commit created!', 'success');
        setCommitMessage('');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to commit', 'error');
    } finally {
      setIsCommitting(false);
    }
  };

  const handlePush = async () => {
    const dir = getProjectDir();
    if (!dir) return;
    
    setIsPushing(true);
    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (res.ok) {
        showMessage('Pushed!', 'success');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to push', 'error');
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = async () => {
    const dir = getProjectDir();
    if (!dir) return;
    
    setIsPulling(true);
    try {
      const res = await fetch('/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir }),
      });
      if (res.ok) {
        showMessage('Pulled!', 'success');
        refreshGit();
      }
    } catch (err) {
      showMessage('Failed to pull', 'error');
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-400" />
            Git
          </h3>
          <button
            onClick={refreshGit}
            disabled={isRefreshing}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Version control</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* Current Branch */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Current Branch</h4>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
            {currentBranch ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">{currentBranch}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                No git repo
                <button
                  onClick={handleInit}
                  className="ml-2 text-blue-400 hover:text-blue-300"
                >
                  Initialize
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Branch */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">New Branch</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="feature/branch-name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
            <button
              onClick={handleCreateBranch}
              disabled={isCreatingBranch || !branchName}
              className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              {isCreatingBranch ? 'Creating...' : <><Plus className="w-4 h-4" /> Create Branch</>}
            </button>
          </div>
        </div>

        {/* Branches List */}
        {branches.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Branches</h4>
            <div className="space-y-1">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => handleCheckout(branch)}
                  disabled={isCheckingOut || branch === currentBranch}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    branch === currentBranch
                      ? 'bg-orange-600/20 text-orange-300 border border-orange-500/30'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Commit */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Commit Changes</h4>
          <div className="space-y-2">
            <textarea
              placeholder="Describe your changes..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
            />
            <button
              onClick={handleCommit}
              disabled={isCommitting || !commitMessage}
              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              {isCommitting ? 'Committing...' : <><GitCommit className="w-4 h-4" /> Commit</>}
            </button>
          </div>
        </div>

        {/* Push/Pull */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePull}
            disabled={isPulling}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            {isPulling ? 'Pulling...' : <><Download className="w-4 h-4" /> Pull</>}
          </button>
          <button
            onClick={handlePush}
            disabled={isPushing}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            {isPushing ? 'Pushing...' : <><Upload className="w-4 h-4" /> Push</>}
          </button>
        </div>

        {/* Status */}
        {status.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Changes</h4>
            <div className="space-y-1">
              {status.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-sm text-gray-300 truncate">{file.filepath}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Commits */}
        {commits.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Commits
            </h4>
            <div className="space-y-2">
              {commits.map((commit) => (
                <div key={commit.oid} className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-white truncate">{commit.commit.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {commit.commit.author.name} • {new Date(commit.commit.author.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
