export async function handler(event) {
  const { query, lat, lng } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const endpoint = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;

  // Map friendly names to valid Places API types
  const typeMap = {
    restaurants: "restaurant",
    bars: "bar",
    cafes: "cafe",
    attractions: "tourist_attraction",
    "things to do with kids": "amusement_park",
    "taxi services": "taxi_stand",
    hospital: "hospital",
    "train stations": "train_station"
  };

  const googleType = typeMap[query.toLowerCase()] || query;

  const body = {
    includedTypes: [googleType],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        },
        radius: 10000, // 10km
      },
    },
  };

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "*",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Places API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
