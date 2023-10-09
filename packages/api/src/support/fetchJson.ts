export async function fetchJson(url: string | URL, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
  const contentTypeRaw = response.headers.get('content-type') ?? '';
  const contentType = (contentTypeRaw.split(';')[0] ?? '').toLowerCase().trim();
  if (contentType !== 'application/json') {
    throw new Error(`Unexpected Content-Type: ${contentType}`);
  }
  return await response.json();
}
