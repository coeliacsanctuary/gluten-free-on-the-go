import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Sidebar from "@/sidebars/Sidebar";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { useEffect, useState } from "react";
import { EateryBranchResource, EateryBranchResponse } from "@/types/eateries";
import { LatLng } from "@/types/types";
import * as Location from "expo-location";
import { eateryGetBranchesRequest } from "@/requests/eateryBranches";
import { Warning } from "@/components/Warning";
import NearbyBranchCard from "@/components/Eateries/NearbyBranchCard";
import { router } from "expo-router";

export type EateryDetailsNationwideBranchesSidebarProps = {
  open: boolean;
  onClose: () => void;
  id: number;
  eateryName: string;
};

export default function EateryDetailsNationwideBranchesSidebar({
  open,
  onClose,
  id,
  eateryName,
}: EateryDetailsNationwideBranchesSidebarProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const [latlng, setLatLng] = useState<LatLng | false>();
  const [nearbyBranches, setNearbyBranches] =
    useState<EateryBranchResource[]>();
  const [branches, setBranches] = useState<EateryBranchResponse[]>();

  const getBranches = () => {
    eateryGetBranchesRequest(id, latlng)
      .then((response) => {
        setNearbyBranches(response.data.data.nearby);
        setBranches(response.data.data.branches);

        setLoading(false);
      })
      .catch(() => {
        alert(
          "Sorry, there was an error loading the branch list. Please try again later.",
        );

        onClose();
      });
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLatLng(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLatLng({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    getBranches();
  }, [latlng]);

  return (
    <Sidebar
      open={open}
      onClose={() => onClose()}
      backgroundColor={Colors.background}
    >
      <ScrollView style={{ backgroundColor: withOpacity(Colors.text, 0.05) }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            backgroundColor: withOpacity(Colors.text, 0.05),
            borderBottomWidth: 1,
            borderBottomColor: withOpacity(Colors.text, 0.1),
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 600 }}>{eateryName}</Text>
        </View>

        {loading || !branches ? (
          <ActivityIndicator
            style={{ padding: 16 }}
            size="large"
            color={Colors.primary}
          />
        ) : (
          <View style={{ gap: 16, padding: 12 }}>
            <Warning>
              <View>
                <Text>
                  Please note while we take every care to keep this list up to
                  date, branches can open and close at any time without warning,
                  please check {eateryName} website for the most accurate
                  information.
                </Text>
              </View>
            </Warning>

            {nearbyBranches && nearbyBranches.length > 0 && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontWeight: 600, fontSize: 16 }}>
                  Nearby Branches
                </Text>

                {nearbyBranches.map((branch) => (
                  <NearbyBranchCard
                    key={branch.id}
                    branch={branch}
                    clickHandler={() => {
                      router.push({
                        pathname: `/(tabs)/nationwide/eatery-details`,
                        params: { id, branchId: branch.id },
                      });

                      onClose();
                    }}
                  />
                ))}
              </View>
            )}

            <Text>Hi</Text>
          </View>
        )}
      </ScrollView>
    </Sidebar>
  );
}
