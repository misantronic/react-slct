"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const List_1 = require("react-virtualized/dist/commonjs/List");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
const menu_container_1 = require("./menu-container");
const option_1 = require("./option");
const utils_1 = require("./utils");
class Menu extends React.PureComponent {
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
        const width = this.props.menuWidth ||
            (rect && rect.width !== 'auto' ? rect.width : 0);
        const height = Math.min(Math.max(options.length * rowHeight, rowHeight), this.props.menuHeight || 185);
        return open ? (React.createElement(menu_container_1.MenuContainer, { error: error, menuWidth: width, menuHeight: height, onRect: this.onRect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List_1.List, { className: "react-slct-menu-list", ref: this.list, width: width, height: height, rowHeight: rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToIndex: selectedIndex, noRowsRenderer: this.emptyRenderer })))) : null;
    }
    rowRenderer({ key, index, style }) {
        const { options = [], labelComponent, selectedIndex, optionComponent, rowHeight, search } = this.props;
        const option = options[index];
        const currentValue = utils_1.isArray(this.props.value)
            ? this.props.value
            : [this.props.value];
        const Component = optionComponent || option_1.OptionComponent;
        return (React.createElement("div", { key: key, style: style },
            React.createElement(Component, { option: option, labelComponent: labelComponent, height: rowHeight, active: currentValue.some(val => utils_1.equal(val, option.value)), selected: selectedIndex === index, search: search, onSelect: this.onSelect })));
    }
    emptyRenderer() {
        const { Empty } = Menu;
        return React.createElement(Empty, { emptyText: this.props.emptyText });
    }
    onSelect(value, option) {
        if (utils_1.isArray(this.props.value)) {
            const found = this.props.value.some(item => utils_1.equal(item, value));
            let values;
            if (found) {
                values = this.props.value.filter(item => !utils_1.equal(item, value));
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
Menu.EmptyOptionItem = styled_components_1.default(option_1.OptionComponent.OptionItem) `
        height: 100%;
    `;
Menu.Empty = (props) => (React.createElement(Menu.EmptyOptionItem, null,
    React.createElement(label_1.SelectLabel, null,
        React.createElement("i", null, props.emptyText || 'No results'))));
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "rowRenderer", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "emptyRenderer", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelect", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onRect", null);
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map