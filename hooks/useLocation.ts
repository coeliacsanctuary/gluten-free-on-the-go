import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { LatLng } from "@/types/types";

export function useCurrentLocation({
  initialLatLng = undefined,
  shouldCheck = true,
}: {
  initialLatLng?: LatLng;
  shouldCheck?: boolean;
} = {}) {
  const [latLng, setLatLng] = useState<LatLng | undefined>(initialLatLng);
  const [loading, setLoading] = useState<boolean>(true);

  const getLocation = useCallback(async () => {
    setLoading(true);

    try {
      const { status: currentStatus } =
        await Location.getForegroundPermissionsAsync();
      let finalStatus = currentStatus;

      if (currentStatus !== "granted") {
        const { status: requestedStatus } =
          await Location.requestForegroundPermissionsAsync();
        finalStatus = requestedStatus;
      }

      if (finalStatus !== "granted") {
        setLoading(false);

        throw new Error("Permission to access location was denied");
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        setLoading(false);

        throw new Error("Location services are not enabled");
      }

      // Warm up provider — this fixes the hang after first use
      const watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced },
        () => {},
      );
      watcher.remove(); // immediately stop

      let location = await Location.getLastKnownPositionAsync({});

      if (!location) {
        try {
          location = await Promise.race([
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
              mayShowUserSettingsDialog: true,
            }),
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error("timeout"));
              }, 8000);
            }),
          ]);
        } catch (e) {
          throw new Error("Location request timed out");
        }
      }

      if (location) {
        setLatLng({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } else {
        throw new Error("Location request timed out");
      }
    } catch (err: any | { message: string }) {
      return { error: err.message };
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (shouldCheck) {
      getLocation();
    }
  }, [getLocation]);

  return {
    latLng,
    setLatLng,
    loading,
    setLoading,
    refresh: getLocation,
    error: undefined,
  };
}
