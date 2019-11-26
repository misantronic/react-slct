"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_window_1 = require("react-window");
const option_1 = require("./option");
const utils_1 = require("./utils");
exports.MenuRow = react_1.memo(({ index, style, data }) => {
    const { options = [], labelComponent, selectedIndex, optionComponent, rowHeight, search, equalCompareProp, multi, onSelect } = data;
    const option = options[index];
    const currentValue = utils_1.isArray(data.value) && multi ? data.value : [data.value];
    const Component = optionComponent || option_1.OptionComponent;
    return (React.createElement("div", { style: style },
        React.createElement(Component, { option: option, labelComponent: labelComponent, height: rowHeight, active: currentValue.some(val => utils_1.equal(val, option.value, equalCompareProp)), selected: selectedIndex === index, search: search, onSelect: onSelect })));
}, react_window_1.areEqual);
//# sourceMappingURL=menu-row.js.map