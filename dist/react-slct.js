(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var _a, _b, _c, _d, _e;
"use strict";
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const value_1 = require("./value");
const menu_1 = require("./menu");
exports.Menu = menu_1.Menu;
const utils_1 = require("./utils");
exports.keys = utils_1.keys;
const typings_1 = require("./typings");
exports.SelectProps = typings_1.SelectProps;
exports.MenuComponentProps = typings_1.MenuComponentProps;
exports.Option = typings_1.Option;
class Select extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nativeSelect = React.createRef();
        this.state = {
            open: false,
            blindText: ''
        };
    }
    get options() {
        const { search } = this.state;
        const { creatable, onCreateText } = this.props;
        let options = this.props.options || [];
        const showCreate = creatable &&
            !options.some(option => option.value === search);
        if (search) {
            options = options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()));
        }
        if (showCreate && search) {
            options = [
                {
                    label: onCreateText
                        ? onCreateText(search)
                        : `Create "${search}"`,
                    value: search,
                    creatable: true
                },
                ...options
            ];
        }
        return options;
    }
    get document() {
        return utils_1.getDocument();
    }
    optionIsCreatable(option) {
        return (this.props.creatable &&
            option.creatable &&
            Boolean(this.props.onCreate && this.state.search));
    }
    componentDidUpdate(_, prevState) {
        if (this.state.blindText &&
            prevState.blindText !== this.state.blindText) {
            this.handleBlindTextUpdate();
        }
    }
    componentWillUnmount() {
        this.removeDocumentListener();
    }
    render() {
        const { Container } = Select;
        const { className, options, creatable, clearable, placeholder, value, disabled, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, multi, native, emptyText } = this.props;
        const { open, search, selectedIndex, focused } = this.state;
        const searchable = this.props.searchable || creatable;
        if (this.props.children) {
            return this.renderChildren();
        }
        return (React.createElement(Container, { className: className ? `react-slct ${className}` : 'react-slct', disabled: disabled, innerRef: this.onContainerRef, onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(value_1.Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: options, placeholder: placeholder, value: value, search: search, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onSearchBlur: this.onSearchBlur, onOptionRemove: this.onOptionRemove }),
            React.createElement(menu_1.Menu, { open: open, options: this.options, value: value, multi: multi, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, emptyText: emptyText, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const clearable = this.props.clearable && native;
        const value = Array.isArray(this.props.value)
            ? this.props.value.map(val => utils_1.toString(val))
            : utils_1.toString(this.props.value || '');
        return (React.createElement(NativeSelect, { innerRef: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            this.options.map(option => {
                const value = utils_1.toString(option.value);
                return (React.createElement("option", { disabled: option.disabled, value: value, key: value }, option.label));
            })));
    }
    renderChildren() {
        const { options, placeholder, multi, children } = this.props;
        const { open, search } = this.state;
        const valueOptions = utils_1.getValueOptions(options || [], this.props.value);
        const value = !multi
            ? this.props.value
            : valueOptions.map(option => option.value);
        const showPlaceholder = !search &&
            (Array.isArray(value)
                ? value.length === 0
                : value === undefined || value === null);
        if (!children) {
            return null;
        }
        return children({
            options: this.options,
            open,
            value,
            MenuContainer: menu_1.MenuContainer,
            placeholder: showPlaceholder ? placeholder : undefined,
            onToggle: () => this.toggleMenu(),
            onRef: ref => (this.container = ref)
        });
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
        const selectedIndex = this.options.findIndex(option => utils_1.toString(option.value) === utils_1.toString(this.props.value));
        this.setState({ open: true, search: undefined, selectedIndex }, () => this.addDocumentListener());
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
        this.removeDocumentListener();
        if (this.document) {
            document.addEventListener('click', this.onDocumentClick);
        }
    }
    removeDocumentListener() {
        if (this.document) {
            document.removeEventListener('click', this.onDocumentClick);
        }
    }
    cleanBlindText() {
        this.blindTextTimeout = setTimeout(() => this.setState({ blindText: '' }), 700);
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
    onOptionSelect(value, option) {
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
        this.setState({ focused: true }, () => this.closeMenu(() => onChange && onChange(value, option)));
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
    onDocumentClick(e) {
        const { target } = e;
        if (target.closest('.react-slct-menu')) {
            return;
        }
        if (this.container && !this.container.contains(target)) {
            this.closeMenu();
        }
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
        const { value } = this.props;
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
                    this.onOptionSelect(Array.isArray(value) ? [...value, newValue] : newValue);
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
    onContainerRef(el) {
        this.container = el;
    }
    handleBlindTextUpdate() {
        const { open, blindText } = this.state;
        const { multi } = this.props;
        if (open) {
            const selectedIndex = this.options.findIndex(option => option.label.toLowerCase().startsWith(blindText.toLowerCase()));
            if (selectedIndex >= 0) {
                this.setState({ selectedIndex });
            }
        }
        else if (!multi) {
            if (blindText) {
                const option = this.options.find(option => option.label
                    .toLowerCase()
                    .startsWith(blindText.toLowerCase()));
                if (option) {
                    this.onOptionSelect(option.value);
                }
            }
            else {
                this.onOptionSelect(undefined);
            }
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
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_b = typeof typings_1.Option !== "undefined" && typings_1.Option) === "function" && _b || Object]),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onDocumentClick", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _c || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyDown", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _d || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyUp", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof HTMLDivElement !== "undefined" && HTMLDivElement) === "function" && _e || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onContainerRef", null);
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
    min-height: 32px;
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
        const { options = [], value, disabled, clearable, open, mobile, multi, focused } = this.props;
        const valueOptions = utils_1.getValueOptions(options, value);
        const showClearer = Boolean(clearable && valueOptions.length && !mobile);
        const searchAtStart = !multi || valueOptions.length === 0;
        const searchAtEnd = multi && valueOptions.length > 0;
        return (React.createElement(ValueContainer, { "data-role": "value", className: "react-slct-value", disabled: disabled, mobile: mobile, focused: focused, onClick: this.onClick },
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
        if (e.metaKey) {
            return;
        }
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
    tslib_1.__metadata("design:paramtypes", [typeof (_b = (typeof React !== "undefined" && React).KeyboardEvent) === "function" && _b || Object]),
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
function getValueOptions(options, value) {
    return options.filter(option => {
        if (isArray(value)) {
            return value.some(val => toString(option.value) === toString(val));
        }
        else {
            return toString(option.value) === toString(value);
        }
    });
}
exports.getValueOptions = getValueOptions;
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
var _a, _b, _c;
"use strict";
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const react_dom_1 = require("react-dom");
const List_1 = require("react-virtualized/dist/commonjs/List");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
const utils_1 = require("./utils");
const typings_1 = require("./typings");
const option_1 = require("./option");
function menuPosition(props) {
    if (!props.rect ||
        props.rect.top + props.rect.height + (props.menuHeight || 185) <=
            utils_1.getWindowInnerHeight()) {
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
        const { open, options = [], multi, selectedIndex } = this.props;
        const { rect } = this.state;
        const MenuContent = this.props.menuComponent;
        const rowHeight = 32;
        const menuHeight = 185;
        const height = Math.min(Math.max(options.length * rowHeight, rowHeight), menuHeight);
        return open ? (React.createElement(MenuContainer, { menuHeight: height, onRect: this.onRect }, MenuContent ? (React.createElement(MenuContent, Object.assign({}, this.props))) : (React.createElement(List_1.List, { className: "react-slct-menu-list", ref: this.list, width: rect ? rect.width : 0, height: height, rowHeight: rowHeight, rowCount: options.length, rowRenderer: this.rowRenderer, scrollToIndex: multi ? 0 : selectedIndex, noRowsRenderer: this.emptyRenderer })))) : null;
    }
    rowRenderer({ key, index, style }) {
        const { options = [], labelComponent, selectedIndex, optionComponent } = this.props;
        const option = options[index];
        const currentValue = utils_1.isArray(this.props.value)
            ? this.props.value.map(val => utils_1.toString(val))
            : [utils_1.toString(this.props.value)];
        const value = utils_1.toString(option.value);
        const Component = optionComponent || option_1.OptionComponent;
        return (React.createElement("div", { key: key, style: style },
            React.createElement(Component, { option: option, labelComponent: labelComponent, active: currentValue.some(val => val === value), selected: selectedIndex === index, onSelect: this.onSelect })));
    }
    emptyRenderer() {
        const { Empty } = Menu;
        return React.createElement(Empty, { emptyText: this.props.emptyText });
    }
    onSelect(value, option) {
        this.props.onSelect(utils_1.isArray(this.props.value)
            ? Array.from(new Set([...this.props.value, value]))
            : value, option);
    }
    onRect(rect) {
        this.setState({ rect });
    }
}
Menu.MenuContainer = styled_components_1.default.div.attrs({
    style: (props) => ({
        top: getContainerTop(props),
        left: `${props.rect ? props.rect.left : 0}px`,
        width: `${props.rect ? props.menuWidth || props.rect.width : 0}px`,
        boxShadow: menuPosition(props) === 'bottom'
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
Menu.Empty = (props) => (React.createElement(option_1.OptionComponent.OptionItem, null,
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
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_a = typeof typings_1.Option !== "undefined" && typings_1.Option) === "function" && _a || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelect", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof typings_1.Rect !== "undefined" && typings_1.Rect) === "function" && _b || Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onRect", null);
exports.Menu = Menu;
class MenuContainer extends React.PureComponent {
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
        return utils_1.getWindow();
    }
    get document() {
        return utils_1.getDocument();
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
        const { menuWidth, menuHeight, children } = this.props;
        return (React.createElement("div", { ref: this.onEl, style: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none'
            } }, this.document
            ? react_dom_1.createPortal(React.createElement(Menu.MenuContainer, { "data-role": "menu", className: "react-slct-menu", rect: this.state.rect, menuWidth: menuWidth, menuHeight: menuHeight }, children), this.document.body)
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
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onViewportChange", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onEl", null);
exports.MenuContainer = MenuContainer;
//# sourceMappingURL=menu.js.map
});
___scope___.file("typings.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=react-slct.js.map
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
        const { active, selected, labelComponent, option } = this.props;
        const Label = labelComponent ? labelComponent : label_1.SelectLabel;
        return (React.createElement(OptionItem, { className: "option", selected: selected, active: active, onClick: this.onClick },
            React.createElement(Label, Object.assign({}, option), option.label)));
    }
    onClick() {
        this.props.onSelect(this.props.option.value, this.props.option);
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
return ___scope___.entry = "index.jsx";
});

FuseBox.import("default/index.jsx");
FuseBox.main("default/index.jsx");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))
//# sourceMappingURL=react-slct.js.map