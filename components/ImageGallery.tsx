import {
  Dimensions,
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { ImageGalleryItem } from "@/types/types";
import Gallery from "react-native-awesome-gallery";
import Modal from "@/modals/Modal";
import Animated from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type ImageGalleryProps = {
  images: ImageGalleryItem[];
  wrapperStyles?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
};

export default function ImageGallery({
  images,
  wrapperStyles,
  header,
}: ImageGalleryProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0);

  const [imageUrls, setImageUrls] = React.useState<string[]>([]);

  useEffect(() => {
    setImageUrls(images.map((image) => image.path));
  }, [images]);

  return (
    <>
      <View style={[wrapperStyles, { gap: 8 }]}>
        {!!header && header}

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {images.map((image, index) => (
            <Pressable
              key={image.id}
              onPress={() => {
                setSelectedImageIndex(index);
                setShowModal(true);
              }}
            >
              <Image
                contentFit="cover"
                source={image.thumbnail}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 4,
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        fullHeight
        style={{ overflow: "hidden", backgroundColor: "black" }}
        closeIconColour="white"
      >
        {showModal && (
          <GestureHandlerRootView
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Gallery
              data={imageUrls}
              initialIndex={selectedImageIndex}
              disableSwipeUp
              disableVerticalSwipe
              style={{
                width: Dimensions.get("window").width * 0.9,
                height: Dimensions.get("window").height * 0.8,
                alignSelf: "center",
              }}
              containerDimensions={{
                width: Dimensions.get("window").width * 0.9,
                height: Dimensions.get("window").height * 0.7,
              }}
            />
          </GestureHandlerRootView>
        )}
      </Modal>
    </>
  );
}
