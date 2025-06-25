const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { query, lat, lng } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!query || !lat || !lng || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query, lat, lng, or API key" }),
    };
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${encodeURIComponent(query)}&location=${lat},${lng}&radius=1500&key=${apiKey}`;

  try {
    const response = await fetch(googleUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data", details: error.message }),
    };
  }
};
