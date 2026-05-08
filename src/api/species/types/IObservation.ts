export type ObservationSource = "inaturalist" | "mushroom_observer" | "specieslink" | "bold";

export interface IObservation {
  id: number;
  source: ObservationSource;
  external_id: string;
  latitude: number;
  longitude: number;
  location_obscured: boolean;
  observed_on: string | null;
  quality_grade: string | null;
  photo_url: string | null;
  url: string | null;
}

export interface IObservationList {
  observations: IObservation[];
  total: number;
}
