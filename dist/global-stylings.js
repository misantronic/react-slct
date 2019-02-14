"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const styled_components_1 = require("styled-components");
const id = 'react-slct-style';
function create() {
    const ReactSlctStyle = styled_components_1.createGlobalStyle `
        .react-slct, .react-slct-menu {
            --react-slct-error-color: #ff5c5c; 
        }
    `;
    const reactSlctDiv = document.createElement('div');
    reactSlctDiv.id = id;
    document.body.append(reactSlctDiv);
    react_dom_1.render(React.createElement(ReactSlctStyle, null), reactSlctDiv);
}
if (!document.getElementById(id)) {
    create();
}
//# sourceMappingURL=global-stylings.js.map