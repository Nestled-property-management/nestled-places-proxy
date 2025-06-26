export async function handler(event) {
  const { query, lat, lng } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Map frontend category names to valid Places API types
  const typeMap = {
    Restaurants: 'restaurant',
    Bars: 'bar',
    Cafes: 'cafe',
    Attractions: 'tourist_attraction',
    Hospital: 'hospital',
    'Things to do with kids': 'amusement_park', // or something appropriate
    'Taxi Services': 'taxi_stand',
    All: '', // Leave blank to return any
  };

  const placeType = typeMap[query] || '';

  const endpoint = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;

  const body = {
    includedTypes: placeType ? [placeType] : undefined, // only send if set
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        },
        radius: 10000,
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
          'places.displayName,places.formattedAddress,places.location,places.types,places.primaryType,places.id,places.nationalPhoneNumber,places.googleMapsUri,places.iconMaskBaseUri,places.iconBackgroundColor,places.photos',
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
