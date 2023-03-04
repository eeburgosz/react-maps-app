import axios from "axios";

const searchApi = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  params: {
    access_token:
      "pk.eyJ1IjoiZWVidXJnb3N6IiwiYSI6ImNsZXU4N2VrajA5Yjg0Nm5xYW9ldjczeTEifQ.y1JII02XWSCHgcqhs6mGbg",
    limit: 5,
    lenguage: "es",
  },
});

export default searchApi;
