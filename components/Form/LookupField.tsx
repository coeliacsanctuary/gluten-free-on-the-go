import { HttpResponse } from "@/types/types";
import DropDownPicker, {
  DropDownPickerProps,
  ItemType,
  ValueType,
} from "react-native-dropdown-picker";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import Label from "@/components/Form/Label";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";

export type LookupFieldProps<
  T = unknown,
  P = unknown,
  R extends ItemType<V> = object,
  V extends ValueType = number,
> = Omit<
  DropDownPickerProps<T>,
  "items" | "open" | "setOpen" | "value" | "multiple"
> & {
  requestParams?: P;
  request: (params?: P) => Promise<AxiosResponse<HttpResponse<T[]>>>;
  responseMapper: (item: T) => R;
  value: V;
  label?: string;
  required?: boolean;
};

export default function LookupFieldField<
  T = unknown,
  P = unknown,
  R extends ItemType<V> = object,
  V extends ValueType = number,
>({
  value,
  setValue,
  request,
  requestParams = undefined,
  responseMapper,
  label = undefined,
  required = false,
  ...rest
}: LookupFieldProps<T, P, R, V>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<R[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      return;
    }

    request(requestParams).then(
      (response: AxiosResponse<HttpResponse<T[]>>) => {
        setItems(response.data.data.map(responseMapper));
        setLoading(false);
      },
    );
  }, []);

  const inputComponent = (
    <DropDownPicker
      style={[
        {
          borderColor: withOpacity(Colors.text, 0.1),
          borderRadius: 4,
          borderWidth: 1,
          padding: 4,
        },
      ]}
      listMode="MODAL"
      open={open}
      loading={loading}
      searchable={true}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      setItems={setItems}
      multiple={false}
      addCustomItem={true}
      {...rest}
    />
  );

  if (label) {
    return (
      <Label label={label} required={required}>
        {inputComponent}
      </Label>
    );
  }

  return inputComponent;
}
