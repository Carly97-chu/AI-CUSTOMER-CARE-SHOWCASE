import React from "react";
import { createRoot } from "react-dom/client";

const App = () =>
  React.createElement(
    "div",
    { className: "text-white text-3xl" },
    "TechFlow AI 🚀"
  );

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(App));
