import {
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import * as ImagePicker from "expo-image-picker";
import { AxiosError, AxiosResponse } from "axios";
import { HttpResponse } from "@/types/types";
import { ImagePickerAsset } from "expo-image-picker/src/ImagePicker.types";
import { getInfoAsync } from "expo-file-system";
import { FileInfo } from "expo-file-system/src/FileSystem.types";
import Label from "@/components/Form/Label";

export type UploadableImage = {
  loading: boolean;
  url?: string;
  id?: string;
};

export type ImageUploadFieldProps = {
  label?: string;
  images: UploadableImage[];
  setImages: Dispatch<SetStateAction<UploadableImage[]>>;
  uploadImages: (
    images: ImagePickerAsset[],
  ) => Promise<AxiosResponse<HttpResponse<UploadableImage[]>>>;
  maxImages?: number;
  onError?: (message: string, error?: Error) => void;
};

export function ImageUploadField({
  images,
  setImages,
  maxImages,
  uploadImages,
  label,
  onError,
}: ImageUploadFieldProps) {
  const [longPressedOn, setLongPressedOn] = useState<number | undefined>();

  const deleteImage = (index: number) => {
    const newImages = images.filter((image, i) => i !== index);

    setImages(newImages);
  };

  const isLoading = () => {
    return images.some((image) => image.loading);
  };

  const hasPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");

      return false;
    }

    return true;
  };

  const isImageInvalid = async (image: string): Promise<boolean> => {
    const info: FileInfo = await getInfoAsync(image);

    console.log({ info });

    // @ts-ignore
    if (!info || !info.size) {
      return false;
    }

    // @ts-ignore
    return info.size >= 5000000;
  };

  const selectImages = async () => {
    if (!(await hasPermission())) {
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      base64: false,
      exif: false,
      allowsMultipleSelection: true,
      selectionLimit: maxImages,
      allowsEditing: false,
    });

    if (response.canceled) {
      return;
    }

    const invalidImages = await Promise.all(
      response.assets.map((a) => isImageInvalid(a.uri)),
    );

    if (invalidImages.filter((invalid) => invalid === true).length > 0) {
      console.log("here");
      onError?.(
        "Sorry, this image is too large, please select an image below 5mb in size.",
      );

      return;
    }

    setImages([...images, ...response.assets.map(() => ({ loading: true }))]);

    uploadImages(response.assets)
      .then((response) => {
        const newImages = images.filter((image) => !image.loading);

        response.data.data.forEach((image) => {
          newImages.push({
            ...image,
            loading: false,
          });
        });

        console.log({ newImages });

        setImages(newImages);
      })
      .catch((error: AxiosError) => {
        console.log({
          message: error.message,
          response: error.response,
          trace: error.stack,
        });
        onError?.("Sorry, there was an error uploading your images", error);

        setImages(images.filter((image) => !image.loading));
      });
  };

  const [containerWidth, setContainerWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    if (containerWidth > 0) {
      setImageWidth((containerWidth - 34) / 3);
    }
  }, [containerWidth]);

  let inputComponent = (
    <>
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        style={{
          borderRadius: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: withOpacity(Colors.text, 0.1),
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            onLongPress={() => {
              setLongPressedOn(index);
            }}
            key={index}
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: 8,
            }}
          >
            <View style={{ position: "relative" }}>
              {image.loading && (
                <View
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors.primaryDark,
                    width: imageWidth,
                    height: imageWidth,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color={Colors.primary} size="large" />
                </View>
              )}
              {!image.loading && !!image.url && (
                <View
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors.primaryDark,
                    width: imageWidth,
                    height: imageWidth,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    contentFit="cover"
                    source={image.url}
                    style={{ width: imageWidth, height: imageWidth }}
                  />
                  {longPressedOn === index && (
                    <Pressable
                      onPress={() => deleteImage(index)}
                      style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: withOpacity(Colors.text, 0.8),
                        width: imageWidth,
                        height: imageWidth,
                        top: 0,
                      }}
                    >
                      <IconSymbol
                        size={48}
                        name="xmark"
                        color={Colors.background}
                      />
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {maxImages && images.length < maxImages && !isLoading() && (
          <Pressable onPress={selectImages}>
            <View
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.primaryDark,
                width: imageWidth,
                height: imageWidth,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconSymbol name="plus" color={Colors.primaryDark} size={48} />
            </View>
          </Pressable>
        )}
      </View>
    </>
  );

  if (label) {
    return (
      <Label label={label} required={false}>
        {inputComponent}
      </Label>
    );
  }

  return inputComponent;
}
