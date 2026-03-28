export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { url, method = 'GET', headers = {}, body } = req.body;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? new URLSearchParams(body) : undefined,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    res.status(response.status).json({ data, status: response.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
