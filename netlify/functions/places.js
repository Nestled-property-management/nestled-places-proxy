import { fetch } from 'undici'; // ✅ Use ESM-compatible fetch

export async function handler(event) {
  const { query, lat, lng } = event.queryStringParameters;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&keyword=${query}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
