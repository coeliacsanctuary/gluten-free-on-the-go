import { ImageGalleryItem, LatLng, SelectBoxOption } from "@/types/types";
import { CustomIconProps } from "@/components/CustomIcon";
import React, { Dispatch, SetStateAction } from "react";

export type EateryType = "Eatery" | "Attraction" | "Hotel";

export type EateryRating =
  | "0"
  | "0.5"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "4.5"
  | "5";

export type BaseEatery = {
  title: string;
  id: number;
  type: EateryType;
  cuisine: string;
};

export type SimpleEatery = BaseEatery & {
  key: number;
  branch_id?: number;
  address: string;
  average_rating: EateryRating;
  number_of_ratings: number;
  distance?: number;
  venueType: string;
  average_expense?: EateryAverageExpense;
};

export type NearbyEatery = SimpleEatery & {};

export type DetailedEatery = BaseEatery & {
  county: string;
  town: string;
  area?: string;
  venue_type: string;
  website?: string;
  menu?: string;
  restaurants: AttractionRestaurant[];
  is_fully_gf: boolean;
  info: string;
  location: LatLng & { address: string };
  phone?: string;
  reviews: {
    number: number;
    average: EateryRating;
    expense?: EateryAverageExpense;
  };
  features: EateryFeature[];
  opening_times?: EateryOpeningTimes;
  branch?: EateryBranch;
  is_nationwide: boolean;
  last_updated: string;
  last_updated_human: string;
  qualifies_for_ai: boolean;
};

export type EateryBranch = {
  id: number;
  name: string;
  county: string;
  town: string;
  area?: string;
  location: LatLng & { address: string };
};

export type AttractionRestaurant = { name: string; info: string };

export type EateryFeature = { name: string; slug: CustomIconProps["name"] };

export type EateryAverageExpense = {
  value: number;
  label: string;
};

export type EateryOpeningTimes = {
  is_open_now: boolean;
  today: { opens: string; closes: string };
};

export type OpeningTimeDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type FullEateryOpeningTimes = EateryOpeningTimes & {
  days: {
    [T in OpeningTimeDay]: { opens: string; closes: string };
  };
};

export type EaterySealiacOverview = {
  overview: string[];
  id: number;
};

export type EateryReview = {
  name?: string;
  published: string;
  date_diff: string;
  body?: string;
  rating: EateryRating;
  expense: EateryAverageExpense;
  food_rating: string;
  service_rating: string;
  branch_name: string;
  images: ImageGalleryItem[];
};

export type EditableEateryData = {
  address: string;
  website?: string;
  gf_menu_link?: string;
  phone?: string;
  type_id: number;
  venue_type: {
    id: number;
    label: string;
    values: SuggestEditSelectBoxOption[];
  };
  cuisine: {
    id: number;
    label: string;
    values: SuggestEditSelectBoxOption[];
  };
  opening_times: {
    [T in OpeningTimeDay | "today"]: [null, null] | [string, string];
  };
  features: {
    selected: {
      id: number;
      label: string;
    }[];
    values: SuggestEditSelectBoxOption[];
  };
  is_nationwide: boolean;
};

export type SuggestEditSelectBoxOption = SelectBoxOption<number, string> & {
  selected: boolean;
};

export type EditableEateryField = {
  id: string;
  label: string;
  shouldDisplay: boolean;
  getter: () => string | null;
  capitalise?: boolean;
  truncate?: boolean;
  updated: boolean;
  currentValue?: () =>
    | string
    | number
    | number[]
    | Record<string, any>
    | Record<string, any>[];
  beforeSend?: (value: EditableEateryNewValue) => EditableEateryNewValue;
  editableComponent: (
    value: EditableEateryNewValue,
    setValue: Dispatch<SetStateAction<EditableEateryNewValue>>,
  ) => React.ReactNode;
};

export type EditableEateryNewValue =
  | string
  | number
  | null
  | (string | number | object)[]
  | Record<string, any>
  | Record<string, any>[];
