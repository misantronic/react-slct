import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, isArray } from './utils';
class OptionComponent extends React.PureComponent {
    render() {
        const { OptionItem } = OptionComponent;
        const { active, selected, label, labelComponent } = this.props;
        const Label = labelComponent ? labelComponent : SelectLabel;
        return (React.createElement(OptionItem, { className: "option", selected: selected, active: active, onClick: this.onClick },
            React.createElement(Label, Object.assign({}, this.props), label)));
    }
    onClick() {
        this.props.onSelect(this.props.value);
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
function getWindowInnerHeight(defaultHeight = 700) {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    return defaultHeight;
}
function menuPosition(rect) {
    if (rect.top + rect.height + 185 <= getWindowInnerHeight()) {
        return 'bottom';
    }
    return 'top';
}
function getContainerTop(props) {
    switch (menuPosition(props.rect)) {
        case 'top':
            return `${props.rect.top - 185 + 1}px`;
        case 'bottom':
            return `${props.rect.top + props.rect.height - 1}px`;
    }
}
export class Options extends React.PureComponent {
    constructor(props) {
        super(props);
        this.list = React.createRef();
    }
    componentDidUpdate(prevProps) {
        const { selectedIndex, search } = this.props;
        const { current } = this.list;
        if (current) {
            if (selectedIndex !== -1 && selectedIndex !== undefined) {
                current.forceUpdateGrid();
                current.scrollToRow(selectedIndex);
            }
            if (search !== prevProps.search) {
                current.forceUpdateGrid();
            }
        }
    }
    render() {
        const { OptionsContainer, Empty } = Options;
        const { open, rect, options, multi, selectedIndex } = this.props;
        return open
            ? createPortal(React.createElement(OptionsContainer, { className: "options-container", rect: rect },
                React.createElement(List, { ref: this.list, width: rect.width, height: 185, rowHeight: 32, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToRow: multi ? 0 : selectedIndex, noRowsRenderer: Empty })), document.body)
            : null;
    }
    rowRenderer({ key, index, style }) {
        const { options, labelComponent, selectedIndex } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value.map(val => toString(val))
            : [toString(this.props.value)];
        const value = toString(option.value);
        return (React.createElement("div", { key: key, style: style },
            React.createElement(OptionComponent, Object.assign({}, option, { labelComponent: labelComponent, active: currentValue.some(val => val === value), selected: selectedIndex === index, onSelect: this.onSelect }))));
    }
    onSelect(value) {
        this.props.onSelect(isArray(this.props.value)
            ? Array.from(new Set([...this.props.value, value]))
            : value);
    }
}
Options.OptionsContainer = styled.div `
        position: fixed;
        left: ${(props) => props.rect.left}px;
        top: ${getContainerTop};
        width: ${(props) => props.rect.width}px;
        z-index: 9999;
        background: #fff;
        box-shadow: ${(props) => menuPosition(props.rect) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

        .ReactVirtualized__List {
            border: 1px solid #ccc;

            &:focus {
                outline: none;
            }
        }
    `;
Options.Empty = () => (React.createElement(OptionComponent.OptionItem, null,
    React.createElement(SelectLabel, null,
        React.createElement("i", null, "No results"))));
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Options.prototype, "rowRenderer", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Options.prototype, "onSelect", null);
//# sourceMappingURL=options.js.map