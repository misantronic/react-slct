import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { isArray, getWindowInnerHeight, getWindow, getDocument, equal } from './utils';
import { OptionComponent } from './option';
function menuPosition(props) {
    if (!props.rect ||
        props.rect.top + props.rect.height + (props.menuHeight || 185) <=
            getWindowInnerHeight()) {
        return 'bottom';
    }
    return 'top';
}
function getContainerTop(props) {
    if (!props.rect) {
        return '0px';
    }
    switch (menuPosition(props)) {
        case 'top':
            return `${props.rect.top - (props.menuHeight || 186)}px`;
        case 'bottom':
            return `${props.rect.top + props.rect.height - 1}px`;
    }
}
``;
export class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.list = React.createRef();
    }
    componentDidUpdate(prevProps) {
        const { search, emptyText, options } = this.props;
        const { current: list } = this.list;
        if (list) {
            if (search !== prevProps.search ||
                emptyText !== prevProps.emptyText ||
                options !== prevProps.options) {
                list.forceUpdateGrid();
            }
        }
    }
    render() {
        const { open, options = [], selectedIndex, error } = this.props;
        const { rect } = this.state;
        const MenuContent = this.props.menuComponent;
        const rowHeight = this.props.rowHeight || 32;
        const menuHeight = 185;
        const height = Math.min(Math.max(options.length * rowHeight, rowHeight), menuHeight);
        return open ? (React.createElement(MenuContainer, { error: error, menuHeight: height, onRect: this.onRect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List, { className: "react-slct-menu-list", ref: this.list, width: rect ? rect.width : 0, height: height, rowHeight: rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToIndex: selectedIndex, noRowsRenderer: this.emptyRenderer })))) : null;
    }
    rowRenderer({ key, index, style }) {
        const { options = [], labelComponent, selectedIndex, optionComponent, rowHeight } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value
            : [this.props.value];
        const Component = optionComponent || OptionComponent;
        return (React.createElement("div", { key: key, style: style },
            React.createElement(Component, { option: option, labelComponent: labelComponent, height: rowHeight, active: currentValue.some(val => equal(val, option.value)), selected: selectedIndex === index, onSelect: this.onSelect })));
    }
    emptyRenderer() {
        const { Empty } = Menu;
        return React.createElement(Empty, { emptyText: this.props.emptyText });
    }
    onSelect(value, option) {
        if (isArray(this.props.value)) {
            const found = this.props.value.some(item => item === value);
            let values;
            if (found) {
                values = this.props.value.filter(item => item !== value);
            }
            else {
                values = Array.from(new Set([...this.props.value, value]));
            }
            this.props.onSelect(values, option);
        }
        else {
            this.props.onSelect(value, option);
        }
    }
    onRect(rect) {
        this.setState({ rect });
    }
}
Menu.MenuContainer = styled.div.attrs((props) => ({
    style: {
        top: getContainerTop(props),
        left: `${props.rect ? props.rect.left : 0}px`,
        width: `${props.rect ? props.menuWidth || props.rect.width : 0}px`
    }
})) `
        position: fixed;
        z-index: 9999;
        background: #fff;
        box-sizing: border-box;
        box-shadow: ${(props) => menuPosition(props) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

        .ReactVirtualized__List {
            border-width: 1px;
            border-style: solid;
            border-color: ${(props) => props.error ? 'var(--react-slct-error-color)' : '#ccc'};
            background-color: #fff;

            &:focus {
                outline: none;
            }
        }
    `;
Menu.Empty = (props) => (React.createElement(OptionComponent.OptionItem, null,
    React.createElement(SelectLabel, null,
        React.createElement("i", null, props.emptyText || 'No results'))));
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "rowRenderer", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "emptyRenderer", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelect", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onRect", null);
export class MenuContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    get rect() {
        if (this.el) {
            const clientRect = this.el.getBoundingClientRect();
            return {
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        }
        return undefined;
    }
    get window() {
        return getWindow();
    }
    get document() {
        return getDocument();
    }
    componentDidMount() {
        this.addListener();
    }
    componentDidUpdate(_, prevState) {
        if (prevState.rect !== this.state.rect && this.props.onRect) {
            this.props.onRect(this.state.rect);
        }
    }
    componentWillUnmount() {
        this.removeListener();
    }
    render() {
        const { menuWidth, menuHeight, error, onRef, children } = this.props;
        const className = ['react-slct-menu', this.props.className]
            .filter(c => c)
            .join(' ');
        return (React.createElement("div", { ref: this.onEl, style: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none'
            } }, this.document
            ? createPortal(React.createElement(Menu.MenuContainer, { "data-role": "menu", className: className, error: error, rect: this.state.rect, menuWidth: menuWidth, menuHeight: menuHeight, ref: onRef }, children), this.document.body)
            : null));
    }
    addListener() {
        if (this.window) {
            this.window.addEventListener('scroll', this.onViewportChange, true);
            this.window.addEventListener('resize', this.onViewportChange, true);
        }
    }
    removeListener() {
        if (this.window) {
            this.window.removeEventListener('resize', this.onViewportChange, true);
            this.window.removeEventListener('scroll', this.onViewportChange, true);
        }
    }
    allowRectChange(e) {
        if (e.target.closest && !e.target.closest('.react-slct-menu')) {
            return false;
        }
        return true;
    }
    onViewportChange(e) {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }
    onEl(el) {
        this.el = el;
        this.setState({
            rect: this.rect
        });
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onViewportChange", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onEl", null);
//# sourceMappingURL=menu.js.map