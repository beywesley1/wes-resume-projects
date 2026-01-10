# Production Caching Strategy for GitHub Stats

## Current Problem
- Each visitor fetches from GitHub API independently
- 1000 visitors = 1000 API calls
- Can hit rate limits (60/hour without token, 5000/hour with token)
- Slow load times when GitHub API is slow

## Recommended Solutions

---

## ✅ Option 1: GitHub Actions (Best for Your Setup)

**How it works:**
1. GitHub Actions runs once per day (scheduled)
2. Fetches fresh stats from GitHub API
3. Updates `src/githubFallback.js` file
4. Commits and pushes changes
5. Triggers deployment to AWS/Azure
6. **All visitors see pre-fetched data (no API calls!)**

**Advantages:**
- ✅ Zero API calls from visitors
- ✅ No additional infrastructure needed
- ✅ Free (GitHub Actions is free for public repos)
- ✅ Works with your existing Terraform deployment
- ✅ Automatic deployment on update

**Setup:**
File already created: `.github/workflows/update-github-stats.yml`

**How to enable:**
1. File is already in place
2. Will run automatically once per day at 2 AM UTC
3. Manual trigger available via GitHub Actions UI

**Benefits:**
- Stats are baked into the build
- CloudFront/Azure CDN serves static data
- Instant load times
- No API rate limits from visitors

---

## Option 2: AWS Lambda + API Gateway (Advanced)

**How it works:**
1. Lambda function runs once per day (EventBridge schedule)
2. Fetches stats from GitHub API
3. Stores in S3 bucket or DynamoDB
4. Your website fetches from S3/DynamoDB instead of GitHub
5. All visitors get cached data

**Architecture:**
```
┌─────────────────┐
│ EventBridge     │ (Daily at 2 AM)
│ Schedule        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│ Lambda Function │─────▶│ GitHub API      │
│ update-stats    │      └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ S3 Bucket       │
│ github-stats.   │
│ json            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CloudFront      │
│ (Your Website)  │
└─────────────────┘
```

**Terraform Example:**
```hcl
# Lambda function to fetch GitHub stats
resource "aws_lambda_function" "github_stats" {
  filename         = "lambda/github-stats.zip"
  function_name    = "portfolio-github-stats-updater"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      GITHUB_TOKEN = var.github_token
      GITHUB_USER  = "beywesley1"
      S3_BUCKET    = aws_s3_bucket.stats_cache.id
    }
  }
}

# EventBridge rule to run daily
resource "aws_cloudwatch_event_rule" "daily" {
  name                = "portfolio-github-stats-daily"
  schedule_expression = "cron(0 2 * * ? *)" # 2 AM UTC daily
}

resource "aws_cloudwatch_event_target" "lambda" {
  rule      = aws_cloudwatch_event_rule.daily.name
  target_id = "GithubStatsLambda"
  arn       = aws_lambda_function.github_stats.arn
}

# S3 bucket for cached stats
resource "aws_s3_bucket" "stats_cache" {
  bucket = "portfolio-github-stats-cache"
}

# Enable CORS for website to fetch
resource "aws_s3_bucket_cors_configuration" "stats_cache" {
  bucket = aws_s3_bucket.stats_cache.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://beyops.com"]
    max_age_seconds = 3600
  }
}
```

**Lambda Function (Node.js):**
```javascript
// lambda/github-stats/index.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

exports.handler = async (event) => {
  const username = process.env.GITHUB_USER;
  const token = process.env.GITHUB_TOKEN;

  // Fetch GitHub stats
  const headers = { Authorization: `token ${token}` };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers })
  ]);

  const user = await userRes.json();
  const repos = await reposRes.json();

  const stats = {
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
    topRepos: repos.slice(0, 6),
    lastUpdated: new Date().toISOString()
  };

  // Store in S3
  const s3 = new S3Client();
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: 'github-stats.json',
    Body: JSON.stringify(stats),
    ContentType: 'application/json',
    CacheControl: 'max-age=86400' // 24 hours
  }));

  return { statusCode: 200, body: 'Stats updated' };
};
```

**Update React Code:**
```javascript
// Fetch from S3 instead of GitHub
const response = await fetch('https://stats-cache.s3.amazonaws.com/github-stats.json');
const cachedStats = await response.json();
```

**Advantages:**
- ✅ Complete control over caching
- ✅ Can add custom metrics
- ✅ S3 is dirt cheap (~$0.01/month)
- ✅ Ultra-fast response times
- ✅ No rate limiting concerns

**Disadvantages:**
- ❌ More complex infrastructure
- ❌ Need to manage Lambda function
- ❌ Additional AWS costs (minimal)

---

## Option 3: Azure Functions (For Azure Deployment)

Same concept as Lambda, but using Azure:

**Resources:**
- Azure Functions (serverless)
- Azure Blob Storage (cache)
- Azure Timer Trigger (daily schedule)

---

## Comparison

| Feature | GitHub Actions | AWS Lambda + S3 | Current (Client-Side) |
|---------|---------------|-----------------|----------------------|
| **API Calls** | 1/day | 1/day | 1000s/day |
| **Load Speed** | Instant (static) | Very Fast (S3) | Slow (GitHub API) |
| **Cost** | Free | ~$0.10/month | Free but poor UX |
| **Complexity** | Low | Medium | Low |
| **Rate Limits** | None (visitors) | None (visitors) | Yes (60/hour) |
| **Infrastructure** | None | Lambda + S3 | None |
| **Best For** | Static sites | Dynamic sites | Development only |

---

## Recommended Approach for Your Portfolio

### **Use GitHub Actions (Option 1)**

**Why:**
1. Your site is **static** (React SPA deployed to S3/Azure)
2. No need for additional infrastructure
3. Free and simple
4. Works perfectly with your Terraform setup
5. Automatic redeployment on stats update

**How it works:**
```
Every Day at 2 AM UTC:
├─ GitHub Actions runs
├─ Fetches latest stats from GitHub API (1 call)
├─ Updates src/githubFallback.js
├─ Commits to repo
├─ Triggers deployment
└─ CloudFront/Azure serves updated static site

When Visitor Loads Site:
├─ Gets pre-baked stats from fallback file
├─ No API calls needed
└─ Instant load time
```

**Implementation:**
```bash
# 1. File already created at:
.github/workflows/update-github-stats.yml

# 2. Enable workflow (automatic)
# Just commit and push the workflow file

# 3. Manual trigger (optional)
# Go to GitHub Actions tab → "Update GitHub Stats" → Run workflow

# 4. Monitor
# Check Actions tab to see daily runs
```

---

## Hybrid Approach (Best of Both Worlds)

Keep the current setup but **disable client-side fetching in production**:

```javascript
// src/App.jsx
function useGitHubStats(username) {
  const fallbackData = getFallbackData(username);
  const [stats, setStats] = useState(fallbackData?.stats || null);
  const [repos, setRepos] = useState(fallbackData?.repos || []);
  const [loading, setLoading] = useState(false);
  const [linesOfCode, setLinesOfCode] = useState(fallbackData?.linesOfCode || null);

  useEffect(() => {
    // Only fetch in development or if data is older than 7 days
    const isProd = import.meta.env.PROD;
    const dataAge = Date.now() - new Date(fallbackData?.lastUpdated).getTime();
    const isStale = dataAge > 7 * 24 * 60 * 60 * 1000; // 7 days

    if (isProd && !isStale) {
      // In production with fresh fallback data: skip API call
      setLoading(false);
      return;
    }

    // In development or if data is stale: fetch from API
    fetchGitHubData();
  }, [username]);

  return { stats, repos, loading, linesOfCode };
}
```

**Result:**
- **Production:** Only uses pre-baked fallback data (fast, no API calls)
- **Development:** Still fetches live data for testing
- **Fallback safety:** If fallback data is >7 days old, fetch fresh data

---

## Summary

**For Your Portfolio - Recommended Setup:**

1. ✅ **Enable GitHub Actions workflow** (already created)
2. ✅ **Keep fallback data** (for instant display)
3. ✅ **Disable client-side API calls in production** (add isProd check)
4. ✅ **Stats update daily via Actions** (automatic)
5. ✅ **Zero API calls from visitors** (all from static files)

**Benefits:**
- Instant page loads
- No rate limiting
- Free
- Simple to maintain
- Works with existing infrastructure

**To Deploy:**
```bash
# Already done! Just commit the workflow file:
git add .github/workflows/update-github-stats.yml
git commit -m "feat: add daily GitHub stats updater"
git push
```

The workflow will run automatically every day at 2 AM UTC and update your stats!
