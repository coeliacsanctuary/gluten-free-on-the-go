import { DetailedEatery } from "@/types/eateries";
import { Text } from "react-native";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import ImageGallery from "@/components/ImageGallery";
import { ImageGalleryItem } from "@/types/types";
import { getReviewImagesRequest } from "@/requests/eateryReviews";

export type EateryVisitorImagesCardPropsProps = {
  eatery: DetailedEatery;
  eateryName: string;
  showAllReviews: boolean;
};

export default function EateryVisitorImagesCard({
  eatery,
  eateryName,
  showAllReviews,
}: EateryVisitorImagesCardPropsProps) {
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState<ImageGalleryItem[]>([]);

  useEffect(() => {
    getReviewImagesRequest(eatery.id, eatery.branch?.id, showAllReviews)
      .then((response) => {
        setImages(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [showAllReviews]);

  if (loading || images.length === 0) {
    return null;
  }

  return (
    <Card>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>
        Photos from other visitors to {eateryName}
      </Text>

      <Text>
        Here are some photos taken at {eateryName} that other visitors have
        submitted!
      </Text>

      <ImageGallery images={images} />
    </Card>
  );
}
