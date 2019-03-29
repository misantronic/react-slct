"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class Remove extends React.PureComponent {
    render() {
        const { StyledRemove } = Remove;
        return (React.createElement(StyledRemove, { className: "remove", type: "button", tabIndex: -1, onClick: this.onClick }, "\u00D7"));
    }
    onClick(e) {
        e.stopPropagation();
        this.props.onClick(this.props.value);
    }
}
Remove.StyledRemove = styled_components_1.default.button `
        cursor: pointer;
        color: #007eff;
        border: none;
        background: none;
        padding: 2px 4px;
        margin: 0;
        margin-right: 4px;
        line-height: 1;
        display: inline-block;
        border-right: 1px solid rgba(0, 126, 255, 0.24);
        margin-left: -2px;
        font-size: 13px;

        &:hover {
            background-color: rgba(0, 113, 230, 0.08);
        }

        &:focus {
            outline: none;
        }
    `;
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Remove.prototype, "onClick", null);
class ValueComponentMulti extends React.PureComponent {
    render() {
        const { TagContainer } = ValueComponentMulti;
        const { option, labelComponent, onRemove } = this.props;
        const Label = (labelComponent || label_1.SelectLabel);
        return (React.createElement(TagContainer, Object.assign({ className: "value-multi" }, option),
            React.createElement(Remove, { value: option.value, onClick: onRemove }, "\u00D7"),
            React.createElement(Label, Object.assign({ type: "value-multi", active: true }, option), option.label)));
    }
}
ValueComponentMulti.TagContainer = styled_components_1.default.div `
        display: flex;
        padding: 0px 3px;
        background-color: rgba(0, 126, 255, 0.08);
        border-radius: 2px;
        border: 1px solid rgba(0, 126, 255, 0.24);
        color: #007eff;
        font-size: 0.9em;
        line-height: 1.4;
        margin: 2px 3px;
        align-items: center;

        &:last-of-type {
            margin-right: 5px;
        }
    `;
exports.ValueComponentMulti = ValueComponentMulti;
//# sourceMappingURL=value-component-multi.js.map