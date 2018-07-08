import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, isArray, getWindowInnerHeight } from './utils';
import { OptionComponent } from './option';
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
export class Menu extends React.PureComponent {
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
        const { MenuContainer, Empty } = Menu;
        const { open, rect, options = [], multi, selectedIndex } = this.props;
        const MenuContent = this.props.menuComponent;
        const rowHeight = 32;
        const menuHeight = 185;
        const height = Math.min(Math.max(options.length * rowHeight, rowHeight), menuHeight);
        return open
            ? createPortal(React.createElement(MenuContainer, { className: "react-slct-menu", rect: rect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List, { className: "react-slct-menu-list", ref: this.list, width: rect.width, height: height, rowHeight: rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToRow: multi ? 0 : selectedIndex, noRowsRenderer: Empty }))), document.body)
            : null;
    }
    rowRenderer({ key, index, style }) {
        const { options = [], labelComponent, selectedIndex, optionComponent } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value.map(val => toString(val))
            : [toString(this.props.value)];
        const value = toString(option.value);
        const Component = optionComponent || OptionComponent;
        return (React.createElement("div", { key: key, style: style },
            React.createElement(Component, { option: option, labelComponent: labelComponent, active: currentValue.some(val => val === value), selected: selectedIndex === index, onSelect: this.onSelect })));
    }
    onSelect(value, option) {
        this.props.onSelect(isArray(this.props.value)
            ? Array.from(new Set([...this.props.value, value]))
            : value, option);
    }
}
// @ts-ignore
Menu.MenuContainer = styled.div.attrs({
    style: (props) => ({
        top: getContainerTop(props),
        left: `${props.rect.left}px`,
        width: `${props.rect.width}px`,
        boxShadow: menuPosition(props.rect) === 'bottom'
            ? '0 2px 5px rgba(0, 0, 0, 0.1)'
            : '0 -2px 5px rgba(0, 0, 0, 0.1)'
    })
}) `
        position: fixed;
        z-index: 9999;
        background: #fff;
        box-sizing: border-box;

        .ReactVirtualized__List {
            border: 1px solid #ccc;

            &:focus {
                outline: none;
            }
        }
    `;
Menu.Empty = () => (React.createElement(OptionComponent.OptionItem, null,
    React.createElement(SelectLabel, null,
        React.createElement("i", null, "No results"))));
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "rowRenderer", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelect", null);
//# sourceMappingURL=menu.js.map