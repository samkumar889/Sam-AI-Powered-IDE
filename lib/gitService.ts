import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import http from 'isomorphic-git/http/node';

interface GitInitOptions {
  dir: string;
  defaultBranch?: string;
}

interface GitCommitOptions {
  dir: string;
  message: string;
  author: { name: string; email: string };
}

interface GitPushOptions {
  dir: string;
  remote?: string;
  ref?: string;
  token?: string;
}

interface GitPullOptions {
  dir: string;
  remote?: string;
  ref?: string;
  token?: string;
}

export class GitService {
  async init({ dir, defaultBranch = 'main' }: GitInitOptions) {
    await git.init({
      fs,
      dir,
      defaultBranch,
    });
    return { success: true, branch: defaultBranch };
  }

  async status(dir: string) {
    const files = await git.statusMatrix({ fs, dir });
    return files.map(([filepath, headStatus, indexStatus, worktreeStatus]) => ({
      filepath,
      head: headStatus,
      index: indexStatus,
      worktree: worktreeStatus
    }));
  }

  async add({ dir, filepath }: { dir: string; filepath: string }) {
    await git.add({
      fs,
      dir,
      filepath,
    });
  }

  async addAll(dir: string) {
    const files = await git.statusMatrix({ fs, dir });
    for (const [filepath] of files) {
      try {
        await git.add({ fs, dir, filepath });
      } catch (e) {
        // ignore errors
      }
    }
  }

  async commit({ dir, message, author }: GitCommitOptions) {
    const sha = await git.commit({
      fs,
      dir,
      message,
      author,
    });
    return { success: true, sha };
  }

  async push({ dir, remote = 'origin', ref, token }: GitPushOptions) {
    const auth = token ? { username: token, password: '' } : undefined;
    const result = await git.push({
      fs,
      http,
      dir,
      remote,
      ref: ref || (await this.getCurrentBranch(dir)),
      onAuth: auth ? () => auth : undefined,
    });
    return result;
  }

  async pull({ dir, remote = 'origin', ref, token }: GitPullOptions) {
    const auth = token ? { username: token, password: '' } : undefined;
    const result = await git.pull({
      fs,
      http,
      dir,
      remote,
      ref: ref || (await this.getCurrentBranch(dir)),
      onAuth: auth ? () => auth : undefined,
      author: { name: 'User', email: 'user@example.com' },
      committer: { name: 'User', email: 'user@example.com' },
    });
    return result;
  }

  async listBranches(dir: string) {
    const branches = await git.listBranches({
      fs,
      dir,
    });
    return branches;
  }

  async getCurrentBranch(dir: string) {
    const branch = await git.currentBranch({
      fs,
      dir,
    });
    return branch;
  }

  async checkoutBranch({ dir, ref }: { dir: string; ref: string }) {
    await git.checkout({
      fs,
      dir,
      ref,
    });
    return { success: true, ref };
  }

  async createBranch({ dir, ref, checkout = true }: { dir: string; ref: string; checkout?: boolean }) {
    await git.branch({
      fs,
      dir,
      ref,
      checkout,
    });
    return { success: true, ref };
  }

  async log(dir: string, depth: number = 20) {
    const commits = await git.log({
      fs,
      dir,
      depth,
    });
    return commits;
  }
}

export const gitService = new GitService();
