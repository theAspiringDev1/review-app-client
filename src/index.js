import React from "react";
import { render } from "react-dom";
import App from "components/App";
import Global from "util/Global";

render(
    <Global>
        <App />
    </Global>,
    document.getElementById("root")
);
