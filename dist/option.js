import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
export class OptionComponent extends React.PureComponent {
    render() {
        const { OptionItem } = OptionComponent;
        const { active, selected, labelComponent, option } = this.props;
        const Label = labelComponent ? labelComponent : SelectLabel;
        return (React.createElement(OptionItem, { className: "option", selected: selected, active: active, onClick: this.onClick },
            React.createElement(Label, Object.assign({}, option), option.label)));
    }
    onClick() {
        this.props.onSelect(this.props.option.value, this.props.option);
    }
}
OptionComponent.OptionItem = styled.div `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: 32px;
        padding: 0 10px;
        min-width: 0;
        cursor: pointer;
        box-sizing: border-box;
        background-color: ${(props) => props.active ? '#ddd' : props.selected ? '#eee' : '#fff'};

        &:hover {
            background-color: ${(props) => props.active ? '#ddd' : '#eee'};
        }
    `;
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], OptionComponent.prototype, "onClick", null);
//# sourceMappingURL=option.js.map