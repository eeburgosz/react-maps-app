/*eslint import/no-webpack-loader-syntax: off*/
import { useContext, useLayoutEffect, useRef } from "react";

//@ts-ignore
import { Map } from "!maplibre-gl";

import { MapContext, PlacesContext } from "../context";
import { Loading } from "./";

const API_KEY: string = "pfpeBufqNtp3GnL8wTJv";

export const MapView = () => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const { setMap } = useContext(MapContext);
  const mapDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isLoading) {
      const map = new Map({
        container: mapDiv.current!, //! Sé que va a venir un valor, por eso pongo !
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`, // stylesheet location
        center: userLocation, // starting position [lng, lat]
        zoom: 14, // starting zoom
      });
      setMap(map);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      ref={mapDiv}
      style={{
        height: "100vh",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100vw",
      }}
    >
      {userLocation?.join(",")}
    </div>
  );
};
