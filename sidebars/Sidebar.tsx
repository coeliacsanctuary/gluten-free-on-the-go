import {
  Modal as DefaultModal,
  ModalProps as DefaultModalProps,
  Pressable,
  View,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ModalProps = Omit<DefaultModalProps, "visible"> & {
  open?: boolean;
  onClose: () => void;
  side?: "left" | "right";
  backgroundColor?: string;
};

export default function Sidebar({
  children,
  style,
  open = false,
  onClose,
  side = "right",
  backgroundColor = Colors.primary,
  ...rest
}: ModalProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(open);

  const translate = useRef(
    new Animated.Value(side === "left" ? -400 : 400),
  ).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.timing(translate, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translate, {
        toValue: side === "left" ? -400 : 400,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [open, side]);

  if (!visible) return null;

  return (
    <DefaultModal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      {...rest}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: withOpacity(Colors.text, 0.8),
        }}
      >
        {/* Tap outside to close */}
        <Pressable
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          onPress={onClose}
        />

        {/* Sliding sidebar */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: insets.top,
              bottom: 0,
              width: "80%",
              backgroundColor: backgroundColor,
              transform: [{ translateX: translate }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            },
            side === "left" ? { left: 0 } : { right: 0 },
            style,
          ]}
        >
          {/* Close button (correct side now) */}
          <Pressable
            style={{
              position: "absolute",
              top: 8,
              left: side === "right" ? -32 : undefined,
              right: side === "left" ? -32 : undefined,
              zIndex: 10,
            }}
            onPress={onClose}
          >
            <IconSymbol name="xmark" size={24} color={Colors.background} />
          </Pressable>

          {children}
        </Animated.View>
      </View>
    </DefaultModal>
  );
}
