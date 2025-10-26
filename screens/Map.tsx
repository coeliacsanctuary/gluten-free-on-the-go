import { useEffect, useRef, useState } from "react";
import { Marker, Region } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { Dimensions, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { LatLng } from "@/types/types";
import { LoaderCard } from "@/components/LoaderCard";
import { AppliedEateryFilters, EateryFilters } from "@/types/eateries";
import * as Location from "expo-location";
import { postGeocodeRequest } from "@/requests/geocode";
import TexInputField from "@/components/Form/TextInputField";
import Button from "@/components/Form/Button";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExploreEateriesFilterSidebar from "@/sidebars/ExploreEateriesFilterSidebar";
import { getEateryFilters } from "@/requests/eateryFilters";

export type MapScreenProps = {
  initialSearch: string;
  initialAppliedFilters?: AppliedEateryFilters;
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
    latitudeDelta: 0.06,
    longitudeDelta:
      0.06 * (Dimensions.get("window").width / Dimensions.get("window").height),
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

  const [loading, setLoading] = useState<boolean>(true);
  const [places, setPlaces] = useState<any[]>([]);
  const [latLng, setLatLng] = useState<LatLng>(initialLatLng);

  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);

  const handleSearch = () => {
    if (search.length < 3) {
      alert("Please enter at least three characters to search...");
      return;
    }

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
    // @ts-ignore
    map.current.animateToRegion(
      {
        latitude,
        longitude,
        ...delta,
      },
      500,
    );

    // loadEateries();
  };

  const getPlaces = () => {
    //
  };

  const moveMap = () => {
    //
  };

  const openDetails = (eatery: any) => {
    //
  };

  const handleFiltersChanged = (filters: EateryFilters) => {
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

    if (places.length === 0) {
      return;
    }

    setLoading(true);
    setPlaces([]);
    setTriggerSearch(true);
  }, [showFilterSidebar]);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});

        setLatLng({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    }

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

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        marginTop: -8,
        position: "relative",
        marginBottom: insets.bottom * 2,
      }}
    >
      {loading ? (
        <LoaderCard style={{ height: "100%" }} />
      ) : (
        <>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              flexDirection: "row",
              gap: 8,
              padding: 8,
              alignItems: "center",
              zIndex: 99999,
            }}
          >
            <TexInputField
              style={{ flex: 1, backgroundColor: Colors.background }}
              placeholder="Search..."
              iconSuffix="magnifyingglass"
              value={search}
              onChangeText={(text) => setSearch(text)}
              onEndEditing={() => handleSearch()}
            />

            <Button
              size="small"
              theme="secondary"
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
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
            style={{
              width: "100%",
              height: "100%",
            }}
            clusterColor={Colors.secondary}
          >
            {places.map((eatery) => (
              <Marker
                key={eatery.id + (eatery.branch_id ? eatery.branch_id : 0)}
                coordinate={{
                  latitude: eatery.lat,
                  longitude: eatery.lng,
                }}
                pinColor={Colors.primary}
                stopPropagation={false}
                onPress={() => openDetails(eatery)}
              />
            ))}
          </MapView>

          {filters && (
            <ExploreEateriesFilterSidebar
              open={showFilterSidebar}
              onClose={() => setShowFilterSidebar(false)}
              filters={filters as EateryFilters}
              onFiltersChanged={handleFiltersChanged}
            />
          )}
        </>
      )}
    </View>
  );
}
