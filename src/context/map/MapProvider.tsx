/*eslint import/no-webpack-loader-syntax: off*/
import { useContext, useEffect, useReducer } from "react";
//@ts-ignore
import { LngLatBounds, Map, Marker, Popup } from "!maplibre-gl";
import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";
import { PlacesContext } from "../";
import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces/directions";
import axios from "axios";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
  markers: Marker[];
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: Props) => {
  const { places } = useContext(PlacesContext);
  useEffect(() => {
    //console.log(places);
    state.markers.forEach((marker) => marker.remove());
    const newMarkers: Marker[] = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(`
      <h6>${place.text}</h6>
      <p>${place.place_name}</p>
      `);

      const newMarker = new Marker()
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(state.map!);
      newMarkers.push(newMarker);
    }

    //TODO: limpiar polyline
    dispatch({ type: "setMarkers", payload: newMarkers });
  }, [places]);

  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`
    <h4>Aquí estoy</h4>
    <p>En algún lugar del mundo</p>    
    `);

    new Marker({
      color: "#61DAFB",
    })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map);
    dispatch({ type: "setMap", payload: map });
  };

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const resp =
      await //! Tuve qué traerme todo el código de directionsApi. Axios me lanzaba error porque seguía haciendo la petición al baseURL de searchApi y no conseguí la manera de que lo hiciera con el baseURL correcto.
      axios
        .create({
          baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
          params: {
            access_token:
              "pk.eyJ1IjoiZWVidXJnb3N6IiwiYSI6ImNsZXU4N2VrajA5Yjg0Nm5xYW9ldjczeTEifQ.y1JII02XWSCHgcqhs6mGbg",
            alternatives: false,
            geometries: "geojson",
            overview: "simplified",
            steps: false,
          },
        })
        //!---------------------------------------------------------------------------------------------------
        .get<DirectionsResponse>(`/${start.join(",")};${end.join(",")}`);

    const { distance, duration, geometry } = resp.data.routes[0];

    const { coordinates: coords } = geometry;

    let kms = distance / 1000;
    kms = Math.round(kms * 100);
    kms = kms / 100;

    const minutes = Math.floor(duration / 60);
    console.log({ kms, minutes });

    const bounds = new LngLatBounds(start, start);

    for (const coord of coords) {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    }
    state.map?.fitBounds(bounds, { padding: 200 });

    //? Polyline
    const sourceData: any = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };
    //TODO: Remover polyline si existe
    if (state.map?.getLayer("RouteString")) {
      state.map.removeLayer("RouteString");
      state.map.removeSource("RouteString");
    }

    state.map?.addSource("RouteString", sourceData);
    state.map?.addLayer({
      id: "RouteString",
      type: "line",
      source: "RouteString",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "black",
        "line-width": 3,
      },
    });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        //* Methods
        setMap,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
