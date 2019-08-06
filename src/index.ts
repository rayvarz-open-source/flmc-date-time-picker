import { Picker, Options, PickerTypes, Localization } from "./picker";
import IElement from "flmc-lite-renderer/build/flmc-data-layer/FormController/IElement";
import { PickerValueType } from "./picker";

const defaultLocalization: Localization = {
  ok: "Ok",
  cancel: "Cancel",
  now: "Now",
  clear: "Clear"
};

const defaultOptions = {
  showNow: true,
  clearable: true,
  localization: defaultLocalization
};

function TimePicker(value: PickerValueType, options?: Options): IElement {
  let _options: Options;
  if (!options)
    _options = {
      ...defaultOptions,
      format: "LT",
      type: PickerTypes.TimePicker
    };
  else _options = options;
  return Picker(value, _options);
}

function DatePicker(value: PickerValueType, options?: Options): IElement {
  let _options: Options;
  if (!options)
    _options = {
      ...defaultOptions,
      format: "dddd, MMMM Do YYYY",
      type: PickerTypes.DatePicker
    };
  else _options = options;
  return Picker(value, _options);
}

function DateTimePicker(value: PickerValueType, options?: Options): IElement {
  let _options: Options;
  if (!options)
    _options = {
      ...defaultOptions,
      format: "dddd, MMMM Do YYYY [-] LT",
      type: PickerTypes.DateTimePicker
    };
  else _options = options;
  return Picker(value, _options);
}

export { Picker, TimePicker, DatePicker, DateTimePicker };
