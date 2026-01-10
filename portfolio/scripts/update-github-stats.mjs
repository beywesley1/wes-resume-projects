import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const USERNAME = process.env.GITHUB_USERNAME || 'beywesley1';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

if (TOKEN) {
  headers.Authorization = `token ${TOKEN}`;
}

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} for ${url}: ${text}`);
  }
  return res.json();
}

async function ghJsonAllow202(url) {
  const res = await fetch(url, { headers });
  if (res.status === 202) {
    return { _status: 202 };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} for ${url}: ${text}`);
  }
  return res.json();
}

async function fetchWithRetry(url, retries = 8, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    const data = await ghJsonAllow202(url);
    if (data && data._status === 202) {
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      continue;
    }
    return data;
  }
  return null;
}

async function main() {
  const user = await ghJson(`https://api.github.com/users/${USERNAME}`);
  const repos = await ghJson(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`
  );

  const totalStars = Array.isArray(repos) ? repos.reduce((acc, r) => acc + (r?.stargazers_count || 0), 0) : 0;
  const totalForks = Array.isArray(repos) ? repos.reduce((acc, r) => acc + (r?.forks_count || 0), 0) : 0;

  const topRepos = (Array.isArray(repos) ? repos : [])
    .slice()
    .sort((a, b) => (b?.stargazers_count || 0) - (a?.stargazers_count || 0))
    .slice(0, 6);

  const reposWithLanguages = await Promise.all(
    topRepos.map(async (repo) => {
      let languages = {};
      try {
        languages = await ghJson(repo.languages_url);
      } catch {
        languages = {};
      }

      return {
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        languages,
        pushed_at: repo.pushed_at,
        updated_at: repo.updated_at,
      };
    })
  );

  // Compute approximate lines added/deleted across recent repos.
  // Uses /stats/code_frequency which returns weekly additions/deletions for the repo.
  // Note: deletions are negative numbers in this API.
  let totalAdded = 0;
  let totalDeleted = 0;

  // Prefer computing from local git history when available (reliable in GitHub Actions
  // because the repo is checked out). This will reflect the current repository history.
  // This avoids the flaky /stats/* GitHub endpoints which can return 202/empty.
  let computedFromGit = false;
  try {
    const out = execSync('git log --numstat --pretty=tformat:', { encoding: 'utf8' });
    const lines = out.split(/\r?\n/);
    for (const line of lines) {
      // Format: added<TAB>deleted<TAB>path
      const parts = line.split('\t');
      if (parts.length < 3) continue;
      const [a, d] = parts;
      if (a === '-' || d === '-') continue; // binary
      totalAdded += Number(a) || 0;
      totalDeleted += Number(d) || 0;
    }
    computedFromGit = totalAdded > 0 || totalDeleted > 0;
  } catch {
    computedFromGit = false;
  }

  if (!computedFromGit) {
    const recentReposForLoc = (Array.isArray(repos) ? repos : []).slice(0, 10);
    for (const repo of recentReposForLoc) {
      if (!repo?.name) continue;
      try {
        const url = `https://api.github.com/repos/${USERNAME}/${repo.name}/stats/code_frequency`;
        const data = await fetchWithRetry(url);
        if (!Array.isArray(data)) continue;

        for (const week of data) {
          // week format: [unix_timestamp, additions, deletions]
          const additions = Array.isArray(week) ? week[1] : 0;
          const deletions = Array.isArray(week) ? week[2] : 0;
          totalAdded += Number(additions) || 0;
          // deletions are negative
          totalDeleted += Math.abs(Number(deletions) || 0);
        }
      } catch {
        // ignore per-repo failures
      }
    }
  }

  const payload = {
    username: USERNAME,
    updatedAt: new Date().toISOString(),
    stats: {
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars,
      totalForks,
    },
    repos: reposWithLanguages,
    linesOfCode: {
      added: totalAdded,
      deleted: totalDeleted,
    },
  };

  const outPath = path.join(process.cwd(), 'portfolio', 'public', 'github-stats.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
