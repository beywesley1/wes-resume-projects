import { useEffect, useState } from 'react';
import { getFallbackData } from '../githubFallback';

// GitHub Stats Hook - Optimized with fallback data and long-term caching
function useGitHubStats(username) {
  // Load fallback data immediately to avoid "..." placeholders
  const fallbackData = getFallbackData(username);
  const [stats, setStats] = useState(fallbackData?.stats || null);
  const [repos, setRepos] = useState(fallbackData?.repos || []);
  const [loading, setLoading] = useState(false); // Start as false since we have fallback
  const [linesOfCode, setLinesOfCode] = useState(fallbackData?.linesOfCode || null);

  // GitHub token from environment variable (increases rate limit from 60 to 5000 requests/hour)
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  const headers = githubToken ? { Authorization: 'token ' + githubToken } : {};

  useEffect(() => {
    if (!username || username === 'YOUR_GITHUB_USERNAME') {
      setLoading(false);
      return;
    }

    // In production, only use fallback data (updated daily by GitHub Actions)
    // Skip API calls to avoid rate limiting and improve performance
    const isProd = import.meta.env.PROD;
    if (isProd && fallbackData) {
      // Check if fallback data is recent (less than 7 days old)
      const dataAge = Date.now() - new Date(fallbackData.lastUpdated).getTime();
      const isFresh = dataAge < 7 * 24 * 60 * 60 * 1000; // 7 days

      if (isFresh) {
        // Use fresh fallback data, skip API call
        setLoading(false);
        return;
      }
    }

    // Check for cached data in localStorage (valid for 24 hours)
    const cacheKey = `github_stats_${username}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache if less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setStats(data.stats);
          setRepos(data.repos);
          setLinesOfCode(data.linesOfCode);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    async function fetchData() {
      try {
        // Fetch user data and repos in parallel
        const [userRes, allReposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers }),
        ]);

        if (!userRes.ok) {
          setLoading(false);
          return;
        }

        const [userData, allReposData] = await Promise.all([userRes.json(), allReposRes.json()]);

        // Get top 6 repos for display and fetch their languages
        const top6Repos = allReposData.slice(0, 6);
        const displayRepos = await Promise.all(
          top6Repos.map(async (repo) => {
            try {
              const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
              const languages = langRes.ok ? await langRes.json() : {};
              return { ...repo, languages };
            } catch {
              return { ...repo, languages: {} };
            }
          })
        );

        const statsData = {
          publicRepos: userData.public_repos,
          followers: userData.followers,
        };

        setStats(statsData);
        setRepos(displayRepos);

        // Fetch lines of code from contributor stats with retry logic
        // GitHub's stats API returns 202 on first request while computing, need to retry
        let totalAdded = 0;
        let totalDeleted = 0;

        const fetchWithRetry = async (url, retries = 8, delay = 1500) => {
          for (let i = 0; i < retries; i++) {
            try {
              const res = await fetch(url, { headers });
              if (res.status === 200) {
                const data = await res.json();
                return data;
              } else if (res.status === 202) {
                // GitHub is computing stats, wait and retry
                await new Promise((r) => setTimeout(r, delay * (i + 1)));
              } else if (res.status === 204) {
                // No content - empty repo
                return [];
              } else if (res.status === 403) {
                // Rate limited - stop retrying
                return null;
              } else {
                return null;
              }
            } catch {
              // Network error - retry
              await new Promise((r) => setTimeout(r, delay));
            }
          }
          return null;
        };

        // Fetch contributor stats for each repo to get lines added/deleted
        const statsPromises = allReposData.slice(0, 10).map(async (repo) => {
          try {
            const statsData = await fetchWithRetry(
              `https://api.github.com/repos/${username}/${repo.name}/stats/contributors`
            );
            if (Array.isArray(statsData)) {
              // Find the user's contributions
              const userStats = statsData.find((c) => c.author?.login?.toLowerCase() === username.toLowerCase());
              if (userStats && userStats.weeks) {
                userStats.weeks.forEach((week) => {
                  totalAdded += week.a || 0;
                  totalDeleted += week.d || 0;
                });
              }
            }
          } catch {
            // Silently fail for individual repos
          }
        });

        await Promise.all(statsPromises);
        // Only set lines of code if we actually got some data, otherwise use fallback
        const linesData =
          totalAdded > 0 || totalDeleted > 0
            ? { added: totalAdded, deleted: totalDeleted }
            : fallbackData?.linesOfCode || null;
        setLinesOfCode(linesData);

        // Cache the results in localStorage for 24 hours
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: {
              stats: statsData,
              repos: displayRepos,
              linesOfCode: linesData,
            },
            timestamp: Date.now(),
          })
        );
      } catch {
        // Silently handle GitHub API errors
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return { stats, repos, loading, linesOfCode };
}

export default useGitHubStats;
