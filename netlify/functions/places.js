export async function handler(event) {
  const { query, lat, lng } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const endpoint = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;

  const body = {
    includedTypes: [query], // e.g., 'restaurant', 'bar', 'hospital'
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        },
        radius: 10000, // 10 km
      },
    },
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.displayName,places.formattedAddress,places.location,places.types,places.primaryType,places.id,places.nationalPhoneNumber,places.shortFormattedAddress,places.googleMapsUri,places.iconBackgroundColor,places.iconMaskBaseUri,places.photos',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Places API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
