import {
  KeyboardAvoidingView,
  Modal as DefaultModal,
  ModalProps as DefaultModalProps,
  Platform,
  Pressable,
  View,
} from "react-native";
import React from "react";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { DimensionValue } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export type ModalProps = Omit<DefaultModalProps, "visible"> & {
  open?: boolean;
  closable?: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  width?: DimensionValue;
  fullHeight?: boolean;
  closeIconColour?: string;
};

export default function Modal({
  children,
  style,
  open = false,
  closable = true,
  onClose = () => undefined,
  header = undefined,
  width = "90%",
  fullHeight = false,
  closeIconColour = Colors.text,
  ...rest
}: ModalProps) {
  return (
    <DefaultModal
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={() => onClose()}
      {...rest}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: withOpacity(Colors.text, 0.8),
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              {
                maxHeight: "80%",
                width,
                backgroundColor: Colors.background,
                borderRadius: 16,
                overflow: "hidden",
                position: "absolute",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
              },
              fullHeight && { height: "80%" },
              style,
            ]}
          >
            {(header || closable) && (
              <View
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                  !!header && {
                    backgroundColor: withOpacity(Colors.text, 0.05),
                    borderBottomWidth: 1,
                    borderBottomColor: withOpacity(Colors.text, 0.1),
                    padding: 8,
                  },
                ]}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {header}
                </View>
                {closable && (
                  <Pressable onPress={() => onClose()}>
                    <View style={{ padding: 8 }}>
                      <IconSymbol
                        name="xmark"
                        size={24}
                        color={closeIconColour}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            )}

            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </DefaultModal>
  );
}
