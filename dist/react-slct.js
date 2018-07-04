(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var _a, _b, _c;
"use strict";
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const value_1 = require("./value");
const menu_1 = require("./menu");
exports.Menu = menu_1.Menu;
const utils_1 = require("./utils");
const typings_1 = require("./typings");
exports.SelectProps = typings_1.SelectProps;
exports.MenuComponentProps = typings_1.MenuComponentProps;
exports.Option = typings_1.Option;
class Select extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nativeSelect = React.createRef();
        this.container = React.createRef();
        this.state = {
            open: false,
            blindText: '',
            rect: { left: 0, top: 0, width: 0, height: 0 }
        };
    }
    get options() {
        const { search } = this.state;
        const { creatable } = this.props;
        let options = this.props.options;
        const showCreate = Boolean(creatable && search) &&
            !options.some(option => option.value === search);
        if (search) {
            options = options.filter(option => option.label.toLowerCase().startsWith(search.toLowerCase()));
        }
        if (showCreate) {
            options = [
                { label: `Create "${search}"`, value: search, creatable: true },
                ...options
            ];
        }
        return options;
    }
    get window() {
        return utils_1.getWindow();
    }
    get document() {
        return utils_1.getDocument();
    }
    get rect() {
        let rect = this.state.rect;
        if (this.container.current) {
            const clientRect = this.container.current.getBoundingClientRect();
            rect = {
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        }
        return rect;
    }
    optionIsCreatable(option) {
        return (this.props.creatable &&
            option.creatable &&
            Boolean(this.props.onCreate && this.state.search));
    }
    componentDidUpdate(_, prevState) {
        if (prevState.open && !this.state.open) {
            this.removeScrollListener();
            this.removeResizeListener();
        }
        if (!prevState.open && this.state.open) {
            this.addScrollListener();
            this.addResizeListener();
        }
        if (this.state.blindText &&
            prevState.blindText !== this.state.blindText) {
            this.handleBlindTextUpdate();
        }
    }
    componentWillUnmount() {
        this.removeDocumentListener();
        this.removeScrollListener();
        this.removeResizeListener();
    }
    render() {
        const { Container } = Select;
        const { className, options, creatable, clearable, placeholder, value, disabled, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, multi, native } = this.props;
        const { open, search, rect, selectedIndex, focused } = this.state;
        const searchable = this.props.searchable || creatable;
        return (React.createElement(Container, { className: className ? `react-slct ${className}` : 'react-slct', disabled: disabled, innerRef: this.container, onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(value_1.Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: options, placeholder: placeholder, value: value, search: search, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onSearchBlur: this.onSearchBlur, onOptionRemove: this.onOptionRemove }),
            React.createElement(menu_1.Menu, { open: open, options: this.options, rect: rect, value: value, multi: multi, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const clearable = this.props.clearable && native;
        const value = multi
            ? (this.props.value || []).map(val => utils_1.toString(val))
            : utils_1.toString(this.props.value || '');
        return (React.createElement(NativeSelect, { innerRef: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            this.options.map(option => {
                const value = utils_1.toString(option.value);
                return (React.createElement("option", { disabled: option.disabled, value: value, key: value }, option.label));
            })));
    }
    toggleMenu() {
        const open = !this.state.open;
        if (open) {
            this.openMenu();
        }
        else {
            this.closeMenu();
        }
    }
    openMenu() {
        const rect = this.rect;
        const selectedIndex = this.options.findIndex(option => utils_1.toString(option.value) === utils_1.toString(this.props.value));
        this.setState({ open: true, search: undefined, selectedIndex, rect }, () => this.addDocumentListener());
    }
    closeMenu(callback = () => { }) {
        this.removeDocumentListener();
        this.setState({
            open: false,
            search: undefined,
            selectedIndex: undefined
        }, callback);
    }
    createOption(value) {
        const { onCreate } = this.props;
        if (onCreate) {
            this.closeMenu(() => onCreate(value));
        }
    }
    addDocumentListener() {
        if (this.document) {
            document.addEventListener('click', this.onDocumentClick);
        }
    }
    removeDocumentListener() {
        if (this.document) {
            document.removeEventListener('click', this.onDocumentClick);
        }
    }
    addScrollListener() {
        if (this.window) {
            this.window.addEventListener('scroll', this.onScroll, true);
        }
    }
    cleanBlindText() {
        this.blindTextTimeout = setTimeout(() => this.setState({ blindText: '' }), 700);
    }
    removeScrollListener() {
        if (this.window) {
            this.window.removeEventListener('scroll', this.onScroll, true);
        }
    }
    addResizeListener() {
        if (this.window) {
            this.window.addEventListener('resize', this.onResize, true);
        }
    }
    removeResizeListener() {
        if (this.window) {
            this.window.removeEventListener('resize', this.onResize, true);
        }
    }
    onChangeNativeSelect(e) {
        const { onChange, multi } = this.props;
        const { currentTarget } = e;
        if (onChange) {
            if (currentTarget.value === '') {
                this.onClear();
            }
            else {
                const values = Array.from(currentTarget.selectedOptions).map(htmlOption => this.options[htmlOption.index - 1].value);
                if (multi) {
                    onChange(values);
                }
                else {
                    onChange(values[0]);
                }
            }
        }
    }
    onSearchFocus() {
        if (!this.state.open && !this.props.native) {
            this.openMenu();
        }
        this.setState({ focused: true });
    }
    onSearchBlur() {
        this.setState({ focused: false });
    }
    onOptionSelect(value) {
        const { current } = this.nativeSelect;
        const { onChange, creatable } = this.props;
        if (creatable) {
            const createValue = (val) => {
                const option = this.options.find(option => this.optionIsCreatable(option) && option.value === val);
                if (option) {
                    this.createOption(option.value);
                }
            };
            if (utils_1.isArray(value)) {
                value.map(createValue);
            }
            else {
                createValue(value);
            }
        }
        if (current) {
            current.value = utils_1.isArray(value)
                ? value.map(val => utils_1.toString(val))
                : utils_1.toString(value);
        }
        this.setState({ focused: true }, () => this.closeMenu(() => onChange && onChange(value)));
    }
    onOptionRemove(value) {
        if (utils_1.isArray(this.props.value)) {
            const values = this.props.value.filter(val => utils_1.toString(val) !== utils_1.toString(value));
            this.onOptionSelect(values);
        }
    }
    onClear() {
        this.onOptionSelect(this.props.multi ? [] : undefined);
    }
    onSearch(search) {
        this.setState({ search }, () => {
            if (this.options.length === 1 || (this.props.creatable && search)) {
                this.setState({ selectedIndex: 0 });
            }
            else {
                this.setState({ selectedIndex: undefined });
            }
            if (this.props.onSearch) {
                this.props.onSearch(search);
            }
        });
    }
    onDocumentClick() {
        this.closeMenu();
    }
    onKeyDown({ keyCode }) {
        const { searchable, creatable } = this.props;
        switch (keyCode) {
            case utils_1.keys.TAB:
                if (this.state.open) {
                    this.closeMenu();
                }
                break;
        }
        if (!searchable && !creatable) {
            this.handleBlindText(keyCode);
        }
    }
    onKeyUp({ keyCode }) {
        const { search, open } = this.state;
        const { multi, value } = this.props;
        let selectedIndex = this.state.selectedIndex;
        switch (keyCode) {
            case utils_1.keys.ARROW_UP:
                if (open) {
                    if (selectedIndex !== undefined) {
                        selectedIndex = selectedIndex - 1;
                        if (selectedIndex < 0) {
                            selectedIndex = this.options.length - 1;
                        }
                    }
                    this.setState({ selectedIndex });
                }
                else {
                    this.openMenu();
                }
                break;
            case utils_1.keys.ARROW_DOWN:
                if (open) {
                    if (selectedIndex === undefined ||
                        selectedIndex === this.options.length - 1) {
                        selectedIndex = 0;
                    }
                    else {
                        selectedIndex = selectedIndex + 1;
                    }
                    this.setState({ selectedIndex });
                }
                else {
                    this.openMenu();
                }
                break;
            case utils_1.keys.ENTER:
                if (this.state.selectedIndex === 0 &&
                    this.optionIsCreatable(this.options[0])) {
                    this.createOption(search);
                }
                else if (selectedIndex !== undefined &&
                    this.options[selectedIndex]) {
                    const newValue = this.options[selectedIndex].value;
                    this.onOptionSelect(multi ? [...value, newValue] : newValue);
                }
                break;
            case utils_1.keys.ESC:
                if (open) {
                    this.closeMenu();
                }
                break;
        }
    }
    handleBlindText(keyCode) {
        const { blindText } = this.state;
        if (keyCode === utils_1.keys.BACKSPACE && blindText.length) {
            clearTimeout(this.blindTextTimeout);
            this.setState({
                blindText: blindText.slice(0, blindText.length - 1)
            }, this.cleanBlindText);
        }
        else if (keyCode === utils_1.keys.SPACE) {
            clearTimeout(this.blindTextTimeout);
            this.setState({
                blindText: blindText + ' '
            }, this.cleanBlindText);
        }
        else {
            const key = String.fromCodePoint(keyCode);
            if (/\w/.test(key)) {
                clearTimeout(this.blindTextTimeout);
                this.setState({
                    blindText: blindText + key
                }, this.cleanBlindText);
            }
        }
    }
    handleBlindTextUpdate() {
        const { open, blindText } = this.state;
        if (open) {
            const selectedIndex = this.options.findIndex(option => option.label.toLowerCase().startsWith(blindText.toLowerCase()));
            if (selectedIndex >= 0) {
                this.setState({ selectedIndex });
            }
        }
        else {
            if (blindText) {
                const option = this.options.find(option => option.label
                    .toLowerCase()
                    .startsWith(blindText.toLowerCase()));
                if (option) {
                    this.onOptionSelect(option.value);
                }
            }
            else {
                this.onOptionSelect(this.props.multi ? [] : undefined);
            }
        }
    }
    allowRectChange(e) {
        if (this.state.open) {
            if (e.target &&
                e.target.classList &&
                e.target.classList.contains('react-slct-menu-list')) {
                return false;
            }
            return true;
        }
        return false;
    }
    onScroll(e) {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }
    onResize(e) {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }
}
Select.Container = styled_components_1.default.div `
        display: flex;
        position: relative;
        cursor: default;
        width: 100%;
        box-sizing: border-box;
        pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
        opacity: ${(props) => props.disabled ? 0.75 : 1};
        user-select: none;
    `;
Select.NativeSelect = styled_components_1.default.select `
        display: block;
        z-index: ${(props) => props.native ? '1' : 'auto'};
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
    `;
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "toggleMenu", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "cleanBlindText", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = (typeof React !== "undefined" && React).SyntheticEvent) === "function" && _a || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onChangeNativeSelect", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearchFocus", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearchBlur", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onOptionSelect", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onOptionRemove", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onClear", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearch", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onDocumentClick", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _b || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyDown", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _c || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyUp", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onScroll", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onResize", null);
exports.Select = Select;
//# sourceMappingURL=index.js.map
});
___scope___.file("value.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var _a, _b, _c;
"use strict";
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
const utils_1 = require("./utils");
const value_component_multi_1 = require("./value-component-multi");
const value_component_single_1 = require("./value-component-single");
const Button = styled_components_1.default.button `
    background: transparent;
    border: none;
    margin: 0;
    font-size: 20px;
    padding: 0;
    line-height: 1;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;
const ArrowButton = styled_components_1.default(Button) `
    font-size: 12px;
    color: #ccc;
    transform: translateY(2px);

    &:hover {
        color: #333;
    }
`;
const ValueContainer = styled_components_1.default.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-height: ${(props) => props.mobile ? '42px' : '32px'};
    pointer-events: ${(props) => props.mobile || props.disabled ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border: 1px solid #ccc;
    z-index: 0;
    box-sizing: border-box;
    max-width: 100%;
    box-shadow: ${(props) => props.focused ? 'rgba(0, 0, 0, 0.15) 0 0 2px' : 'none'};
`;
const ValueLeft = styled_components_1.default.div `
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: ${(props) => props.multi && props.hasValue ? 'wrap' : 'nowrap'};
    user-select: none;
    min-width: 0;
    box-sizing: border-box;
    margin: ${(props) => (props.multi ? '-2px -5px' : 0)};
`;
const ValueRight = styled_components_1.default.div `
    display: flex;
    align-items: center;
    margin-left: 4px;
    box-sizing: border-box;
`;
const Placeholder = styled_components_1.default(label_1.SelectLabel) `
    color: #aaa;
`;
const Clearer = styled_components_1.default(Button) `
    margin-right: 6px;
    color: #ccc;

    &:hover {
        color: #333;
    }
`;
const Search = styled_components_1.default.span `
    min-width: 1px;
    margin-left: ${(props) => (props.multi ? '4px' : '-1px')};
    height: 16px;
    opacity: ${(props) => (props.canSearch ? 1 : 0)};
    user-select: text;

    &:focus {
        outline: none;
    }
`;
class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.search = React.createRef();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.search && !this.props.search && this.search.current) {
            this.search.current.innerText = '';
        }
        if (prevProps.focused !== this.props.focused && this.props.focused) {
            this.focus();
        }
    }
    render() {
        const { options, value, disabled, clearable, open, mobile, multi, focused } = this.props;
        const valueOptions = options.filter(option => {
            if (utils_1.isArray(value)) {
                return value.some(val => utils_1.toString(option.value) === utils_1.toString(val));
            }
            else {
                return utils_1.toString(option.value) === utils_1.toString(value);
            }
        });
        const showClearer = Boolean(clearable && valueOptions.length && !mobile);
        const searchAtStart = !multi || valueOptions.length === 0;
        const searchAtEnd = multi && valueOptions.length > 0;
        return (React.createElement(ValueContainer, { className: "value-container", disabled: disabled, mobile: mobile, focused: focused, onClick: this.onClick },
            React.createElement(ValueLeft, { className: "value-left", multi: multi, hasValue: !!valueOptions.length },
                searchAtStart && this.renderSearch(),
                this.renderValues(valueOptions),
                searchAtEnd && this.renderSearch()),
            React.createElement(ValueRight, { className: "value-right" },
                showClearer && (React.createElement(Clearer, { tabIndex: -1, className: "clearer", onClick: this.onClear }, "\u00D7")),
                React.createElement(ArrowButton, { className: "arrow", tabIndex: -1 }, open ? '▲' : '▼'))));
    }
    renderSearch() {
        const { open, disabled, searchable, multi, onSearchFocus, onSearchBlur } = this.props;
        const canSearch = open && searchable;
        if (disabled) {
            return null;
        }
        return (React.createElement(Search, { className: "search", contentEditable: true, multi: multi, canSearch: canSearch, onInput: this.onSearch, onKeyDown: this.onKeyDown, onFocus: onSearchFocus, onBlur: onSearchBlur, innerRef: this.search }));
    }
    renderValues(valueOptions) {
        const { placeholder, search, labelComponent, valueComponentSingle, valueComponentMulti, multi } = this.props;
        if (search && !multi) {
            return null;
        }
        if (valueOptions.length === 0 && !search) {
            return React.createElement(Placeholder, null, placeholder);
        }
        const Single = valueComponentSingle || value_component_single_1.ValueComponentSingle;
        const Multi = valueComponentMulti || value_component_multi_1.ValueComponentMulti;
        return valueOptions.map(option => multi ? (React.createElement(Multi, { key: utils_1.toString(option.value), option: option, labelComponent: labelComponent, onRemove: this.props.onOptionRemove })) : (React.createElement(Single, { key: utils_1.toString(option.value), option: option, labelComponent: labelComponent })));
    }
    focus() {
        if (this.search.current) {
            this.search.current.focus();
        }
    }
    onClick() {
        if (!this.props.disabled) {
            this.focus();
            this.props.onClick();
        }
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
    onSearch(e) {
        if (this.props.searchable) {
            this.props.onSearch(e.currentTarget.innerText.trim());
        }
        else {
            e.preventDefault();
        }
    }
    onKeyDown(e) {
        const { searchable } = this.props;
        if ((!searchable && e.keyCode !== utils_1.keys.TAB) ||
            e.keyCode === utils_1.keys.ENTER ||
            e.keyCode === utils_1.keys.ARROW_UP ||
            e.keyCode === utils_1.keys.ARROW_DOWN) {
            e.preventDefault();
        }
    }
}
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onClick", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = (typeof React !== "undefined" && React).SyntheticEvent) === "function" && _a || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onClear", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = (typeof React !== "undefined" && React).SyntheticEvent) === "function" && _b || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onSearch", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _c || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onKeyDown", null);
exports.Value = Value;
//# sourceMappingURL=value.js.map
});
___scope___.file("label.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const styled_components_1 = require("styled-components");
exports.SelectLabel = styled_components_1.default.span `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    box-sizing: border-box;
`;
//# sourceMappingURL=label.js.map
});
___scope___.file("utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toString(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value && typeof value === 'object') {
        if (value.toJSON) {
            value = value.toJSON();
        }
    }
    return JSON.stringify(value);
}
exports.toString = toString;
function isArray(val) {
    if (Array.isArray(val)) {
        return true;
    }
    // this is just a workaround for potential observable arrays
    if (val && val.map) {
        return true;
    }
    return false;
}
exports.isArray = isArray;
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return undefined;
}
exports.getDocument = getDocument;
function getWindow() {
    if (typeof window !== 'undefined') {
        return window;
    }
    return undefined;
}
exports.getWindow = getWindow;
function getWindowInnerHeight(defaultHeight = 700) {
    const window = getWindow();
    if (window) {
        return window.innerHeight;
    }
    return defaultHeight;
}
exports.getWindowInnerHeight = getWindowInnerHeight;
exports.keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,
    SPACE: 32
};
//# sourceMappingURL=react-slct.js.map
});
___scope___.file("value-component-multi.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var _a;
"use strict";
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class Remove extends React.PureComponent {
    render() {
        const { StyledRemove } = Remove;
        return (React.createElement(StyledRemove, { className: "remove", tabIndex: -1, onClick: this.onClick }, "\u00D7"));
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
    tslib_1.__metadata("design:paramtypes", [typeof (_a = (typeof React !== "undefined" && React).SyntheticEvent) === "function" && _a || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Remove.prototype, "onClick", null);
class ValueComponentMulti extends React.PureComponent {
    render() {
        const { TagContainer } = ValueComponentMulti;
        const { option, labelComponent, onRemove } = this.props;
        const Label = labelComponent || label_1.SelectLabel;
        return (React.createElement(TagContainer, Object.assign({ className: "value-multi" }, option),
            React.createElement(Remove, { value: option.value, onClick: onRemove }, "\u00D7"),
            React.createElement(Label, Object.assign({}, option), option.label)));
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
    `;
exports.ValueComponentMulti = ValueComponentMulti;
//# sourceMappingURL=value-component-multi.js.map
});
___scope___.file("value-component-single.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const label_1 = require("./label");
exports.ValueComponentSingle = (props) => {
    const Label = props.labelComponent || label_1.SelectLabel;
    return (React.createElement(Label, Object.assign({ className: "value-single" }, props.option), props.option.label));
};
//# sourceMappingURL=value-component-single.js.map
});
___scope___.file("menu.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const react_dom_1 = require("react-dom");
const List_1 = require("react-virtualized/dist/commonjs/List");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
const utils_1 = require("./utils");
const option_1 = require("./option");
function menuPosition(rect) {
    if (rect.top + rect.height + 185 <= utils_1.getWindowInnerHeight()) {
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
class Menu extends React.PureComponent {
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
        const { open, rect, options, multi, selectedIndex } = this.props;
        const MenuContent = this.props.menuComponent;
        const rowHeight = 32;
        const menuHeight = 185;
        const height = Math.min(Math.max(options.length * rowHeight, rowHeight), menuHeight);
        return open
            ? react_dom_1.createPortal(React.createElement(MenuContainer, { className: "react-slct-menu", rect: rect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List_1.List, { className: "react-slct-menu-list", ref: this.list, width: rect.width, height: height, rowHeight: rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToRow: multi ? 0 : selectedIndex, noRowsRenderer: Empty }))), document.body)
            : null;
    }
    rowRenderer({ key, index, style }) {
        const { options, labelComponent, selectedIndex, optionComponent } = this.props;
        const option = options[index];
        const currentValue = utils_1.isArray(this.props.value)
            ? this.props.value.map(val => utils_1.toString(val))
            : [utils_1.toString(this.props.value)];
        const value = utils_1.toString(option.value);
        const Component = optionComponent || option_1.OptionComponent;
        return (React.createElement("div", { key: key, style: style },
            React.createElement(Component, Object.assign({}, option, { labelComponent: labelComponent, active: currentValue.some(val => val === value), selected: selectedIndex === index, onSelect: this.onSelect }))));
    }
    onSelect(value) {
        this.props.onSelect(utils_1.isArray(this.props.value)
            ? Array.from(new Set([...this.props.value, value]))
            : value);
    }
}
// @ts-ignore
Menu.MenuContainer = styled_components_1.default.div.attrs({
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
Menu.Empty = () => (React.createElement(option_1.OptionComponent.OptionItem, null,
    React.createElement(label_1.SelectLabel, null,
        React.createElement("i", null, "No results"))));
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "rowRenderer", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelect", null);
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map
});
___scope___.file("option.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class OptionComponent extends React.PureComponent {
    render() {
        const { OptionItem } = OptionComponent;
        const { active, selected, label, labelComponent } = this.props;
        const Label = labelComponent ? labelComponent : label_1.SelectLabel;
        return (React.createElement(OptionItem, { className: "option", selected: selected, active: active, onClick: this.onClick },
            React.createElement(Label, Object.assign({}, this.props), label)));
    }
    onClick() {
        this.props.onSelect(this.props.value);
    }
}
OptionComponent.OptionItem = styled_components_1.default.div `
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
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], OptionComponent.prototype, "onClick", null);
exports.OptionComponent = OptionComponent;
//# sourceMappingURL=option.js.map
});
___scope___.file("typings.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=react-slct.js.map
});
return ___scope___.entry = "index.jsx";
});

FuseBox.import("default/index.jsx");
FuseBox.main("default/index.jsx");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))
//# sourceMappingURL=react-slct.js.map