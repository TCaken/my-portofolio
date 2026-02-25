import { useQuery } from '@tanstack/react-query'
import { fetchGitHubRepos } from './api'

const DEFAULT_USERNAME = 'tcaken'

/**
 * Fetches GitHub repos for the given user with TanStack Query.
 * @param {{ username?: string }} [options]
 */
export function useGitHubRepos(options = {}) {
  const username = options.username ?? DEFAULT_USERNAME
  return useQuery({
    queryKey: ['github', 'repos', username],
    queryFn: () => fetchGitHubRepos({ username }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
