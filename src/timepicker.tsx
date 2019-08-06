import * as React from "react";
import { BehaviorSubject, Observable, isObservable } from "rxjs";
import { map } from "rxjs/operators";
import IElement from "flmc-lite-renderer/build/flmc-data-layer/FormController/IElement";
import {
  TextInput,
  Container,
  Modal,
  Raw,
  Button,
  ContainerDirection,
  ButtonVariant,
  ButtonColor,
  VisibilityType,
  Space
} from "flmc-lite-renderer";
import { isSubject } from "flmc-lite-renderer/build/flmc-data-layer";
import { TextInputElement } from "flmc-lite-renderer/build/form/elements/input/TextInputElement";
import { TimePicker as TimePickerView, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

// TODO: refactor

type Localization = {
  ok: string;
  cancel: string;
  now: string;
  clear: string;
};

const defaultLocalization: Localization = {
  ok: "Ok",
  cancel: "Cancel",
  now: "Now",
  clear: "Clear"
};

type Options = {
  format: string;
  showNow: boolean;
  clearable: boolean;
  inputElement?: TextInputElement;
  localization: Localization;
};

export function TimePicker(
  value: BehaviorSubject<Date | null> | Observable<Date | null> | (Date | null),
  options: Options = {
    format: "LT",
    showNow: true,
    clearable: true,
    localization: defaultLocalization
  }
): IElement {
  let valueContainer: BehaviorSubject<Date | null>;
  if (isSubject(value)) {
    valueContainer = value;
  } else if (isObservable(value)) {
    valueContainer = new BehaviorSubject(null);
    value.subscribe({ next: v => valueContainer.next(v) });
  } else {
    valueContainer = new BehaviorSubject(value);
  }

  // Modal

  // holds last date in valueController so if user canceled any change we roll back changes
  let lastDate: Date | null = null;

  let open = new BehaviorSubject<boolean>(false);

  let modal = Modal(
    Container([
      Raw(_ => <View controller={valueContainer} options={options} />),
      Container([
        Button(options.localization.ok)
          .variant(ButtonVariant.Text)
          .colors(ButtonColor.Primary)
          .onClick(() => open.next(false)),
        Button(options.localization.cancel)
          .variant(ButtonVariant.Text)
          .onClick(() => {
            open.next(false);
            valueContainer.next(lastDate);
          }),
        Container([Space()]), // TODO: container needs atleast one element in flmc <1.0.5, this is a temporary fix
        Button(options.localization.now)
          .variant(ButtonVariant.Text)
          .onClick(() => valueContainer.next(new Date()))
          .visibility(options.showNow ? VisibilityType.Show : VisibilityType.Gone)
      ])
        .direction(ContainerDirection.RowReverse)
        .flex([0, 0, 1, 0])
    ])
  )
    .open(open)
    .visibileHeader(false);

  // Input

  let valueObservable = valueContainer
    .asObservable()
    .pipe(map(v => (v == null ? "" : new MomentUtils().date(v).format(options.format))));
  let inputElement = options.inputElement == null ? new TextInputElement() : options.inputElement;
  inputElement.value(valueObservable);

  // connect input to modal

  inputElement.endIcon("access_time").onEndIconClick(() => {
    lastDate = valueContainer.value;
    open.next(true);
  });

  // clerable
  if (options.clearable) {
    inputElement
      .startIcon(valueContainer.pipe(map(v => (v == null ? undefined : "close"))))
      .onStartIconClick(() => valueContainer.next(null));
  }

  let containerElement = Container([inputElement, modal]);

  return containerElement;
}

type Props = {
  controller: BehaviorSubject<Date | null>;
  options: Options;
};

function View({ controller, options }: Props): React.ReactElement {
  const [value, setValue] = React.useState<Date | null>(null);

  React.useEffect(() => {
    let valueSub = controller.subscribe({ next: v => setValue(v) });

    return () => {
      valueSub.unsubscribe();
    };
  }, []);

  function handleOnChange(v: any) {
    controller.next(v._d);
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <TimePickerView ampm={false} variant="static" openTo="hours" value={value} onChange={handleOnChange} />
    </MuiPickersUtilsProvider>
  );
}
