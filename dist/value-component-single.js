"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueComponentSingle = void 0;
const React = require("react");
const label_1 = require("./label");
exports.ValueComponentSingle = React.memo((props) => {
    const Label = props.labelComponent || label_1.SelectLabel;
    const className = ['value-single', props.className]
        .filter(c => Boolean(c))
        .join(' ');
    return (React.createElement(Label, Object.assign({ active: true, type: "value-single", className: className }, props.option), props.option.label));
});
//# sourceMappingURL=value-component-single.js.map