import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import React, { useState } from "react";
import { DimensionValue } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";

export type CarouselProps<T> = {
  items: T[];
  itemRenderer: (item: T, index: number) => React.ReactNode;
};

export function Carousel<T>({ items, itemRenderer }: CarouselProps<T>) {
  const width: DimensionValue = `${items.length * 100}%`;

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollEnded = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const itemWidth = event.nativeEvent.contentSize.width / items.length;
    const itemIndex = Math.round(event.nativeEvent.contentOffset.x / itemWidth);

    setActiveIndex(itemIndex);
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => scrollEnded(event)}
        contentContainerStyle={{
          width,
        }}
      >
        {items.map((item, index) => itemRenderer(item, index))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 4,
        }}
      >
        {items.map((item, index) => (
          <View
            key={index}
            style={[
              {
                width: 10,
                height: 10,
                borderWidth: 1,
                borderColor: withOpacity(Colors.primaryLight, 0.8),
                borderRadius: "100%",
                marginHorizontal: 4,
              },
              index === activeIndex && {
                backgroundColor: withOpacity(Colors.primaryLight, 0.8),
              },
              index !== activeIndex && { backgroundColor: Colors.background },
            ]}
          />
        ))}
      </View>
    </>
  );
}
