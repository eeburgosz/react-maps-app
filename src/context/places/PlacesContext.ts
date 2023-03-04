import { createContext } from "react";
import { Feature } from "../../interfaces/places";

export interface PlacesContextProps {
  isLoading: boolean;
  userLocation?: [number, number]; //! Latitud y Longitud
  isLoadingPlaces: boolean;
  places: Feature[];
  //* Methods
  searchPlacesByTerm: (query: string) => Promise<Feature[]>;
}

export const PlacesContext = createContext<PlacesContextProps>(
  {} as PlacesContextProps
);
