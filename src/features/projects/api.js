const GITHUB_API = 'https://api.github.com'

/**
 * Fetches public repos for a GitHub user. Sorted by updated date, limited count.
 * @param {{ username: string, perPage?: number }} options
 * @returns {Promise<import('./types').GitHubRepo[]>}
 */
export async function fetchGitHubRepos({ username, perPage = 12 } = {}) {
  const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}`
  const res = await fetch(url)
  if (!res.ok) {
    const msg = res.status === 404 ? `User "${username}" not found` : `GitHub API error: ${res.status}`
    throw new Error(msg)
  }
  return res.json()
}
