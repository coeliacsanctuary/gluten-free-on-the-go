import { EateryRating } from "@/types/eateries";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";

export default function StarRating({
  rating,
  showAll,
  size = 22,
}: {
  rating: EateryRating;
  showAll?: boolean;
  size?: number;
}) {
  const [wholeNumber, setWholeNumber] = useState(0);
  const [hasHalf, setHasHalf] = useState(false);

  const loadStars = () => {
    const parts = rating.toString().split(".");

    setWholeNumber(parseInt(parts[0], 10));

    const remainingNumber = parts[1] ? parseInt(parts[1].charAt(0), 10) : 0;

    setHasHalf(remainingNumber > 3 && remainingNumber < 7);

    if (remainingNumber >= 7) {
      setWholeNumber(wholeNumber + 1);
    }
  };

  useEffect(() => {
    loadStars();
  }, [loadStars]);

  const remainingStars = (): number[] => {
    let remaining = 5 - wholeNumber;

    if (hasHalf) {
      remaining -= 1;
    }

    return Array.from({ length: remaining }) as number[];
  };

  const shouldShowEmptyStars = (): boolean => {
    if (!showAll) {
      return false;
    }

    if (wholeNumber === 5) {
      return false;
    }

    if (wholeNumber === 4 && hasHalf) {
      return false;
    }

    return true;
  };

  return (
    wholeNumber > 0 && (
      <View style={{ display: "flex", flexDirection: "row", gap: 0 }}>
        {Array.from({ length: wholeNumber }).map((_, n: number) => (
          <IconSymbol
            size={size}
            name="star.fill"
            key={n}
            color={Colors.secondary}
          />
        ))}
        {hasHalf && (
          <IconSymbol
            size={size}
            name="star.leadinghalf.filled"
            color={Colors.secondary}
          />
        )}
        {shouldShowEmptyStars() &&
          remainingStars().map((_, n: number) => (
            <IconSymbol
              size={size}
              name="star"
              key={n}
              color={Colors.secondary}
            />
          ))}
      </View>
    )
  );
}
