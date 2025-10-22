import { ValueType } from "react-native-dropdown-picker";

export type LatLng = {
  lat: number;
  lng: number;
};

export type HttpResponse<T> = {
  data: T;
};

export type PaginatedResponse<T> = HttpResponse<{
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}>;

export type ImageGalleryItem = {
  id: number;
  thumbnail: string;
  path: string;
};

export type SelectBoxOption<T extends ValueType = number, L = string> = {
  value: T;
  label: L;
};
