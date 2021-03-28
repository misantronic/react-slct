"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionComponent = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class OptionComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onClick = () => {
            this.props.onSelect(this.props.option.value, this.props.option);
        };
    }
    render() {
        const { OptionItem } = OptionComponent;
        const { active, selected, labelComponent, option, height } = this.props;
        const Label = (labelComponent ? labelComponent : label_1.SelectLabel);
        const className = [
            'option',
            this.props.className,
            selected ? 'selected' : null,
            active ? 'active' : null
        ].filter((v) => Boolean(v));
        return (React.createElement(OptionItem, { "data-role": "option", className: className.join(' '), selected: selected, active: active, height: height, onClick: this.onClick },
            React.createElement(Label, Object.assign({ type: "option", active: active }, option), option.label)));
    }
}
exports.OptionComponent = OptionComponent;
OptionComponent.OptionItem = styled_components_1.default.div `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: ${(props) => props.height || 32}px;
        padding: 0 10px;
        min-width: 0;
        cursor: pointer;
        box-sizing: border-box;
        background-color: ${(props) => props.active ? '#ddd' : props.selected ? '#eee' : '#fff'};

        &:hover {
            background-color: ${(props) => props.active ? '#ddd' : '#eee'};
        }
    `;
//# sourceMappingURL=option.js.map