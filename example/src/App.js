import React from "react";
import logo from "./logo.svg";
import "./App.css";
import FLMC, { FormController, Label } from "flmc-lite-renderer";
import { TimePicker, DatePicker, DateTimePicker } from "flmc-date-time-picker";
import { BehaviorSubject } from "rxjs";

class SampleForm extends FormController {
  time = new BehaviorSubject(null);
  date = new BehaviorSubject(null);
  dateTime = new BehaviorSubject(null);

  elements = [TimePicker(this.time), DatePicker(this.date), DateTimePicker(this.dateTime)];
}

const categoties = {
  root: {
    name: "Root",
    hidden: false
  }
};

const routes = [
  {
    path: "/",
    builder: (path, params) => new SampleForm(),
    category: categoties.root,
    name: "Home",
    hidden: false
  }
];

function App() {
  return <FLMC routes={routes} />;
}

export default App;
