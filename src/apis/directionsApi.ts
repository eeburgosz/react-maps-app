import axios from "axios";

const directionsApi = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    access_token:
      "pk.eyJ1IjoiZWVidXJnb3N6IiwiYSI6ImNsZXU4N2VrajA5Yjg0Nm5xYW9ldjczeTEifQ.y1JII02XWSCHgcqhs6mGbg",
    alternatives: false,
    geometries: "geojson",
    overview: "simplified",
    steps: false,
  },
});

export default directionsApi;
