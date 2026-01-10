// Static fallback data for GitHub stats
// This displays immediately while live data loads, preventing ugly "..." placeholders
// Update these values periodically or after major activity

export const GITHUB_FALLBACK = {
  beywesley1: {
    stats: {
      publicRepos: 25,
      followers: 5,
    },
    linesOfCode: {
      added: 150000,
      deleted: 50000,
    },
    repos: [
      {
        name: 'wes-resume-projects',
        description: 'Portfolio and resume projects showcasing cloud infrastructure',
        stargazers_count: 2,
        forks_count: 0,
        languages: { JavaScript: 60000, CSS: 20000, HTML: 5000 }
      },
      {
        name: 'terraform-modules',
        description: 'Reusable Terraform modules for AWS/Azure infrastructure',
        stargazers_count: 1,
        forks_count: 0,
        languages: { HCL: 30000 }
      },
      {
        name: 'cloud-scripts',
        description: 'PowerShell and Python automation scripts for cloud operations',
        stargazers_count: 1,
        forks_count: 0,
        languages: { PowerShell: 15000, Python: 10000 }
      },
      {
        name: 'kubernetes-configs',
        description: 'Kubernetes manifests and Helm charts',
        stargazers_count: 0,
        forks_count: 0,
        languages: { YAML: 8000 }
      },
      {
        name: 'docker-images',
        description: 'Custom Docker images for various applications',
        stargazers_count: 0,
        forks_count: 0,
        languages: { Dockerfile: 3000, Shell: 2000 }
      },
      {
        name: 'cicd-pipelines',
        description: 'GitHub Actions and Azure Pipelines configurations',
        stargazers_count: 0,
        forks_count: 0,
        languages: { YAML: 5000 }
      }
    ],
    lastUpdated: '2026-01-09' // Update this when you refresh the fallback data
  }
};

// Helper to get fallback data for a user
export function getFallbackData(username) {
  return GITHUB_FALLBACK[username] || null;
}
