export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('pullupTrackerToken');

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('pullupTrackerToken');
    window.location.replace('/auth');
  }
  return response;
}
