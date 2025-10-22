import { HttpResponse } from "@/types/types";
import DropDownPicker, {
  DropDownPickerProps,
  ItemType,
  ValueType,
} from "react-native-dropdown-picker";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import Label from "@/components/Form/Label";

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
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<R[]>([]);

  useEffect(() => {
    if (!open) {
      setItems([]);

      return;
    }

    request(requestParams).then(
      (response: AxiosResponse<HttpResponse<T[]>>) => {
        setItems(response.data.data.map(responseMapper));
        setLoading(false);
      },
    );
  }, [open]);

  let inputComponent = (
    <DropDownPicker
      open={open}
      loading={loading}
      searchable={true}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      multiple={false}
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
