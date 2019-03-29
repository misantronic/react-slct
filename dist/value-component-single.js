"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const label_1 = require("./label");
exports.ValueComponentSingle = React.memo((props) => {
    const Label = props.labelComponent || label_1.SelectLabel;
    return (React.createElement(Label, Object.assign({ type: "value-single", className: "value-single" }, props.option), props.option.label));
});
//# sourceMappingURL=value-component-single.js.map