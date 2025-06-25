const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { query, lat, lng } = event.queryStringParameters;

  if (!query || !lat || !lng) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters: query, lat, lng' }),
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY; // set this in Netlify environment variables
  const endpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&location=${lat},${lng}&radius=2000&key=${apiKey}`;

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
      body: JSON.stringify({ error: 'Failed to fetch places', details: error.message }),
    };
  }
};
