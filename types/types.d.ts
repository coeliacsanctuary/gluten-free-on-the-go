import { ValueType } from "react-native-dropdown-picker";
import React from "react";

export type LatLng = {
  lat: number;
  lng: number;
};

export type HttpResponse<T> = {
  data: T;
};

export type ValidationErrorResponse = {
  message: string;
  errors: Record<string, string[]>;
};

export type PaginatedCollection<T> = {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type PaginatedResponse<T> = HttpResponse<PaginatedCollection<T>>;

export type ImageGalleryItem = {
  id: number;
  thumbnail: string;
  path: string;
};

export type SelectBoxOption<T extends ValueType = number, L = string> = {
  value: T;
  label: L;
  parent?: T;
};

export type CheckboxValue<T = number, L extends React.Key = string> = {
  value: T;
  label: L;
  checked: boolean;
  disabled?: boolean;
  groupBy?: string;
  originalIndex?: number;
};
