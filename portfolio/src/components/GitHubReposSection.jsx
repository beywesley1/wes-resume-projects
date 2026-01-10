import React from 'react';

function GitHubReposSection({ CONFIG, repos, loading, stats, linesOfCode, languageColors, skillsRef, skillsVisible }) {
  return (
    <>
      {/* GitHub Repos Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }} ref={skillsRef}>
        <div className={`container scroll-animate ${skillsVisible ? 'visible' : ''}`}>
          <div className="section-header">
            <p className="section-label">// Projects</p>
            <h2 className="section-title">GitHub Repositories</h2>
          </div>

          <div className="github-repos">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="repo-card">
                    <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 40, marginBottom: 16 }} />
                    <div className="skeleton" style={{ height: 16, width: '40%' }} />
                  </div>
                ))
            ) : repos.length > 0 ? (
              repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card"
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="repo-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    {repo.name}
                  </h3>
                  <p className="repo-description">{repo.description || 'No description available'}</p>
                  <div className="repo-stats">
                    <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                    <span className="repo-stat">🔀 {repo.forks_count}</span>
                  </div>

                  {/* Language breakdown bar */}
                  {repo.languages &&
                    Object.keys(repo.languages).length > 0 &&
                    (() => {
                      const total = Object.values(repo.languages).reduce((a, b) => a + b, 0);
                      const sortedLangs = Object.entries(repo.languages)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6);
                      return (
                        <div className="repo-languages">
                          <div className="repo-language-bar">
                            {sortedLangs.map(([lang, bytes]) => (
                              <div
                                key={lang}
                                className="repo-language-segment"
                                style={{
                                  width: `${(bytes / total) * 100}%`,
                                  background: languageColors[lang] || languageColors.default,
                                }}
                                title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
                              />
                            ))}
                          </div>
                          <div className="repo-language-list">
                            {sortedLangs.map(([lang, bytes]) => (
                              <span key={lang} className="repo-language-item">
                                <span
                                  className="repo-language-dot"
                                  style={{ background: languageColors[lang] || languageColors.default }}
                                />
                                <span className="repo-language-name">{lang}</span>
                                <span className="repo-language-percent">{((bytes / total) * 100).toFixed(1)}%</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                </a>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Configure your GitHub username in CONFIG to display repos</p>
            )}
          </div>

          {/* GitHub Activity Stats - below repos */}
          <div className="github-accounts" style={{ marginTop: '48px' }}>
            <div className="github-account">
              <div className="github-account-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <h3>@{CONFIG.github}</h3>
                <span className="account-type personal">Personal</span>
              </div>

              {/* Stats from API */}
              <div className="github-stats-grid" style={{ marginBottom: '20px' }}>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>📦</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : stats?.publicRepos || 0}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Public Repos</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>👥</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : stats?.followers || 0}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Followers</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>⭐</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Stars</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>🔀</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Forks</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px', color: '#22c55e' }}>++</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : linesOfCode?.added?.toLocaleString() || '—'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lines Added</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px', color: '#ef4444' }}>--</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: 'linear-gradient(135deg, #ef4444, #f87171)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {loading ? '...' : linesOfCode?.deleted?.toLocaleString() || '—'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lines Deleted</div>
                  </div>
                </div>
              </div>

              <div className="github-contribution-graph">
                <img
                  src={`https://ghchart.rshah.org/3b82f6/${CONFIG.github}`}
                  alt="GitHub Contribution Graph"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>

            {CONFIG.workGithub && (
              <div className="github-account">
                <div className="github-account-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <h3>@{CONFIG.workGithub}</h3>
                  <span className="account-type work">Work</span>
                </div>

                <div className="github-contribution-graph">
                  <img
                    src={`https://ghchart.rshah.org/8b5cf6/${CONFIG.workGithub}`}
                    alt="GitHub Contribution Graph"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default GitHubReposSection;
