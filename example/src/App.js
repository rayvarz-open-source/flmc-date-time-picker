import React from "react";
import logo from "./logo.svg";
import "./App.css";
import FLMC, { FormController, Label } from "flmc-lite-renderer";

class SampleForm extends FormController {
  elements = [Label("This is a test label")];
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
