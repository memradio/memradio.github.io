// --- Token Helpers ---
export function getGitHubToken() {
  return localStorage.getItem('github_token') || '';
}

export function saveToken(token){
    localStorage.setItem('github_token', token);
}

export function isLoggedIn() {
  return getGitHubToken().startsWith('ghp_');
}