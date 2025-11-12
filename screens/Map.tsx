import { useEffect, useRef, useState } from "react";
import { Marker, Region } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { Dimensions, Platform, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { LatLng } from "@/types/types";
import { LoaderCard } from "@/components/LoaderCard";
import {
  AppliedEateryFilters,
  BrowseEateryResource,
  EateryFilters,
} from "@/types/eateries";
import { postGeocodeRequest } from "@/requests/geocode";
import TexInputField from "@/components/Form/TextInputField";
import Button from "@/components/Form/Button";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExploreEateriesFilterSidebar from "@/sidebars/ExploreEateriesFilterSidebar";
import { getEateryFilters } from "@/requests/eateryFilters";
import { getBrowseRequest } from "@/requests/browseEateries";
import { CustomIcon } from "@/components/CustomIcon";
import ExploreEateriesDetailsSidebar from "@/sidebars/ExploreEateriesDetailsSidebar";
import { logEvent } from "@/services/analytics";
import { useCurrentLocation } from "@/hooks/useLocation";

export type MapScreenProps = {
  initialSearch: string;
  initialAppliedFilters?: AppliedEateryFilters;
};

type MapMarkers = BrowseEateryResource & {
  loaded: boolean;
  new: boolean;
};

export default function Map({
  initialSearch,
  initialAppliedFilters,
}: MapScreenProps) {
  const initialLatLng: LatLng = {
    lat: 51.5073509,
    lng: -0.1277583,
  };

  const delta: Omit<Region, "latitude" | "longitude"> = {
    latitudeDelta: 0.05,
    longitudeDelta:
      0.05 * (Dimensions.get("window").width / Dimensions.get("window").height),
  };

  const map = useRef<MapView>(null);

  const [search, setSearch] = useState<string>("");
  const [showFilterSidebar, setShowFilterSidebar] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedEateryFilters>({
    category: [],
    venueType: [],
    feature: [],
  });

  const [filters, setFilters] = useState<EateryFilters>();

  const [range, setRange] = useState<number>(5);

  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);

  const [markers, setMarkers] = useState<MapMarkers[]>([]);

  const [showPlaceDetails, setShowPlaceDetails] = useState<
    { id: number; branchId?: number } | false
  >(false);

  const {
    latLng,
    setLatLng,
    loading,
    setLoading,
    refresh: getCurrentLocation,
  } = useCurrentLocation({
    initialLatLng,
    shouldCheck: initialSearch === "",
  });

  const moveMapTimeout = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    return () => {
      if (moveMapTimeout.current) {
        clearTimeout(moveMapTimeout.current);
      }
    };
  }, []);

  const handleSearch = () => {
    if (search.length < 3) {
      alert("Please enter at least three characters to search...");
      return;
    }

    logEvent({
      type: "map-place-search",
      metaData: { search },
    });

    postGeocodeRequest(search)
      .then((response) => {
        navigateToLocation(response.data.data.lat, response.data.data.lng);
      })
      .catch(() => {
        alert(`Sorry, there was an error searching for ${search}...`);
      });
  };

  useEffect(() => {
    if (!triggerSearch) {
      return;
    }

    getPlaces();

    setTriggerSearch(false);
  }, [triggerSearch]);

  const navigateToLocation = (latitude: number, longitude: number) => {
    logEvent({
      type: "map-navigate-to-location",
      metaData: { latitude, longitude },
    });

    // @ts-ignore
    map.current.animateToRegion(
      {
        latitude,
        longitude,
        ...delta,
      },
      500,
    );

    setTriggerSearch(true);
  };

  const getPlaces = () => {
    if (!latLng || !range) {
      return;
    }

    getBrowseRequest(latLng, range, appliedFilters)
      .then((response) => {
        prepareMarkers(response.data.data);
      })
      .catch(() => {
        //
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const prepareMarkers = (eateries: BrowseEateryResource[]) => {
    const newMarkers: MapMarkers[] = eateries.map((eatery) => ({
      ...eatery,
      loaded: true,
      new: true,
    }));

    const currentMarkers: MapMarkers[] = markers.map((marker) => ({
      ...marker,
      loaded: false,
    }));

    newMarkers.forEach((newMarker) => {
      const existingMarker = currentMarkers.find(
        (marker) => marker.id === newMarker.id,
      );

      if (existingMarker) {
        const existingIndex = currentMarkers.indexOf(existingMarker);

        currentMarkers[existingIndex].loaded = true;

        return;
      }

      currentMarkers.push(newMarker);
    });

    setMarkers(currentMarkers.filter((marker) => marker.loaded));
  };

  const moveMap = (region: Region) => {
    setLatLng({ lat: region.latitude, lng: region.longitude });
    setRange((region.latitudeDelta * 111) / 1.609);

    clearTimeout(moveMapTimeout.current);

    moveMapTimeout.current = setTimeout(() => {
      setTriggerSearch(true);
    }, 400);
  };

  const handleFiltersChanged = (filters: EateryFilters) => {
    logEvent({
      type: "map-filters-changed",
      metaData: { filters: JSON.stringify(filters) },
    });

    setAppliedFilters({
      category: filters.categories
        .filter((cat) => cat.checked)
        .map((cat) => cat.value),

      venueType: filters.venueTypes
        .filter((type) => type.checked)
        .map((type) => type.value),

      feature: filters.features
        .filter((feature) => feature.checked)
        .map((feature) => feature.value),
    });
  };

  useEffect(() => {
    if (showFilterSidebar) {
      return;
    }

    setTriggerSearch(true);
  }, [showFilterSidebar]);

  useEffect(() => {
    if (initialSearch === "") {
      getCurrentLocation()
        .then(() => {
          //
        })
        .catch(() => {
          //
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    postGeocodeRequest(initialSearch)
      .then((response) => {
        setLatLng(response.data.data);
      })
      .catch(() => {
        //
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialSearch]);

  useEffect(() => {
    if (initialAppliedFilters) {
      setAppliedFilters(initialAppliedFilters);
    }
  }, [initialAppliedFilters]);

  useEffect(() => {
    if (filters !== undefined) {
      return;
    }

    getEateryFilters().then((response) => {
      setFilters(response.data.data);
    });
  }, [filters]);

  useEffect(() => {
    if (loading) {
      return;
    }

    setTriggerSearch(true);
  }, [loading]);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        { position: "relative" },
        Platform.OS === "ios" && {
          marginTop: -8,
          marginBottom: insets.bottom * 2,
        },
        Platform.OS === "android" && {
          marginTop: -16,
        },
      ]}
    >
      {loading ? (
        <LoaderCard style={{ height: "100%" }} />
      ) : (
        <>
          <View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                flexDirection: "row",
                gap: 8,
                padding: 8,
                alignItems: "center",
                zIndex: 99999,
              },
              Platform.OS === "android" && { right: 48, top: 11 },
            ]}
          >
            <TexInputField
              style={{
                flex: 1,
                backgroundColor: Colors.background,
                paddingVertical: 2,
              }}
              placeholder="Search..."
              iconSuffix="magnifyingglass"
              value={search}
              onChangeText={(text) => setSearch(text)}
              onEndEditing={() => handleSearch()}
            />

            <Button
              size="small"
              theme="secondary"
              style={{ paddingHorizontal: 8, paddingVertical: 6 }}
              clickHandler={() => setShowFilterSidebar(true)}
            >
              <IconSymbol
                name="slider.horizontal.3"
                color={Colors.text}
                size={26}
              />
            </Button>
          </View>

          <MapView
            ref={map}
            userInterfaceStyle="light"
            zoomEnabled
            zoomControlEnabled
            showsUserLocation
            showsMyLocationButton
            provider="google"
            initialRegion={{
              latitude: latLng.lat,
              longitude: latLng.lng,
              ...delta,
            }}
            onRegionChangeComplete={moveMap}
            style={[
              {
                width: "100%",
                height: "100%",
              },
              Platform.OS === "android" && { marginBottom: -74, marginTop: 7 },
            ]}
            clusterColor={Colors.secondary}
            radius={90}
            maxZoom={15}
            toolbarEnabled={false}
          >
            {markers.map((marker) => {
              try {
                return (
                  <Marker
                    key={marker.key}
                    identifier={marker.key}
                    coordinate={{
                      latitude: marker.location.lat,
                      longitude: marker.location.lng,
                    }}
                    stopPropagation={false}
                    tracksViewChanges={false}
                    onPress={() =>
                      setShowPlaceDetails({
                        id: marker.id,
                        branchId: marker.branchId,
                      })
                    }
                  >
                    <CustomIcon
                      name="marker"
                      fill={marker.color}
                      width={40}
                      height={40}
                    />
                  </Marker>
                );
              } catch (e) {
                return null;
              }
            })}
          </MapView>

          {filters && (
            <ExploreEateriesFilterSidebar
              open={showFilterSidebar}
              onClose={() => setShowFilterSidebar(false)}
              filters={filters as EateryFilters}
              onFiltersChanged={handleFiltersChanged}
            />
          )}

          <ExploreEateriesDetailsSidebar
            onClose={() => setShowPlaceDetails(false)}
            eateryId={showPlaceDetails ? showPlaceDetails.id : undefined}
            branchId={showPlaceDetails ? showPlaceDetails.branchId : undefined}
          />
        </>
      )}
    </View>
  );
}
