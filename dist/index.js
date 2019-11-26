"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const styled_components_1 = require("styled-components");
const value_1 = require("./value");
const menu_1 = require("./menu");
exports.Menu = menu_1.Menu;
const menu_container_1 = require("./menu-container");
const utils_1 = require("./utils");
exports.keys = utils_1.keys;
require("./global-stylings");
var option_1 = require("./option");
exports.OptionComponent = option_1.OptionComponent;
var value_component_single_1 = require("./value-component-single");
exports.ValueComponentSingle = value_component_single_1.ValueComponentSingle;
var value_component_multi_1 = require("./value-component-multi");
exports.ValueComponentMulti = value_component_multi_1.ValueComponentMulti;
class Select extends React.PureComponent {
    constructor(props) {
        super(props);
        this.container = null;
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
            !options.some(option => {
                const { value, label } = option;
                // @ts-ignore
                return value === search || label === search;
            });
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
        const { className, options, creatable, clearable, placeholder, value, disabled, error, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, arrowComponent, clearComponent, hideSelectedOptions, equalCompareProp, multi, native, emptyText, rowHeight, menuWidth, menuHeight, keepSearchOnBlur } = this.props;
        const { open, search, selectedIndex, focused } = this.state;
        const searchable = this.props.searchable || creatable;
        if (this.props.children) {
            return this.renderChildren();
        }
        const classNames = [
            'react-slct',
            className,
            open && 'open',
            error && 'has-error'
        ].filter(c => Boolean(c));
        return (React.createElement(Container, { className: classNames.join(' '), disabled: disabled, ref: this.onContainerRef, "data-role": this.props['data-role'], onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(value_1.Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: options, placeholder: placeholder, error: error, value: value, search: search, keepSearchOnBlur: keepSearchOnBlur, equalCompareProp: equalCompareProp, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, arrowComponent: arrowComponent, clearComponent: clearComponent, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onSearchBlur: this.onSearchBlur, onOptionRemove: this.onOptionRemove }),
            React.createElement(menu_1.Menu, { open: open, options: this.options, value: value, multi: multi, error: error, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, hideSelectedOptions: hideSelectedOptions, equalCompareProp: equalCompareProp, emptyText: emptyText, rowHeight: rowHeight, menuWidth: menuWidth, menuHeight: menuHeight, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const dataRole = this.props['data-role']
            ? `select-${this.props['data-role']}`
            : undefined;
        const clearable = this.props.clearable && native;
        const value = utils_1.isArray(this.props.value) && multi
            ? this.props.value.map(this.findOptionIndex)
            : this.findOptionIndex(this.props.value || '');
        return (React.createElement(NativeSelect, { ref: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, "data-role": dataRole, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            this.options.map((option, i) => (React.createElement("option", { key: utils_1.toKey(option.value), value: `${i}`, disabled: option.disabled }, option.label)))));
    }
    renderChildren() {
        const { options, placeholder, multi, children } = this.props;
        const { open, search } = this.state;
        const valueOptions = utils_1.getValueOptions(options || [], this.props.value, this.props.multi, this.props.equalCompareProp);
        const value = !multi
            ? this.props.value
            : valueOptions.map(option => option.value);
        const showPlaceholder = !search &&
            (utils_1.isArray(value) && multi
                ? value.length === 0
                : value === undefined || value === null);
        if (!children) {
            return null;
        }
        return children({
            options: this.options,
            open,
            value,
            MenuContainer: menu_container_1.MenuContainer,
            placeholder: showPlaceholder ? placeholder : undefined,
            onToggle: () => this.toggleMenu(),
            onClose: () => this.closeMenu(),
            onOpen: () => this.openMenu(),
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
        const selectedIndex = this.props.hideSelectedOptions
            ? undefined
            : this.options.findIndex(option => utils_1.equal(option.value, this.props.value, this.props.equalCompareProp));
        const keepSearchOnBlur = this.props.keepSearchOnBlur && !this.props.value;
        this.setState({
            open: true,
            search: keepSearchOnBlur ? this.state.search : undefined,
            selectedIndex
        }, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
            this.addDocumentListener();
        });
    }
    closeMenu(callback = () => { }) {
        const keepSearchOnBlur = this.props.keepSearchOnBlur && !this.props.value;
        this.removeDocumentListener();
        this.setState({
            open: false,
            search: keepSearchOnBlur ? this.state.search : undefined,
            selectedIndex: undefined
        }, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
            callback();
        });
    }
    createOption(value, cb) {
        const { onCreate } = this.props;
        if (onCreate) {
            this.closeMenu(() => {
                onCreate(value);
                if (cb) {
                    cb();
                }
            });
        }
    }
    addDocumentListener() {
        this.removeDocumentListener();
        if (this.document) {
            this.document.addEventListener('click', this.onDocumentClick);
        }
    }
    removeDocumentListener() {
        if (this.document) {
            this.document.removeEventListener('click', this.onDocumentClick);
        }
    }
    cleanBlindText() {
        this.blindTextTimeout = setTimeout(() => this.setState({ blindText: '' }), 700);
    }
    findOptionIndex(val) {
        let index = this.options.findIndex(option => option.value === val);
        if (index === -1) {
            if (typeof val === 'object') {
                index = this.options.findIndex(option => utils_1.equal(option.value, val, this.props.equalCompareProp));
            }
            if (index === -1) {
                return '';
            }
        }
        return String(index);
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
        const { open, focused } = this.state;
        if (!open && !focused && !this.props.native) {
            this.openMenu();
        }
        this.setState({ focused: true });
    }
    onSearchBlur() {
        this.setState({ focused: false });
    }
    onOptionSelect(value, option) {
        const { current } = this.nativeSelect;
        const { multi, onChange, creatable } = this.props;
        let optionWasCreated = false;
        const selectOnNative = () => {
            if (current) {
                current.value =
                    utils_1.isArray(value) && multi
                        ? value.map(this.findOptionIndex)
                        : this.findOptionIndex(value);
            }
            this.setState({ focused: true }, () => this.closeMenu(() => onChange && onChange(value, option)));
        };
        if (creatable) {
            const createValue = (val) => {
                const option = this.options.find(option => this.optionIsCreatable(option) && option.value === val);
                if (option) {
                    optionWasCreated = true;
                    this.createOption(option.value, selectOnNative);
                }
            };
            if (utils_1.isArray(value) && multi) {
                value.map(createValue);
            }
            else {
                createValue(value);
            }
        }
        if (!optionWasCreated) {
            selectOnNative();
        }
    }
    onOptionRemove(value) {
        if (utils_1.isArray(this.props.value) && this.props.multi) {
            const values = this.props.value.filter(val => !utils_1.equal(val, value, this.props.equalCompareProp));
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
        if (target.closest('.react-slct-menu') ||
            target.closest('.react-slct-value')) {
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
        const { value, multi } = this.props;
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
                    const option = this.options[selectedIndex];
                    const newValue = option.value;
                    this.onOptionSelect(utils_1.isArray(value) && multi
                        ? [...value, newValue]
                        : newValue, option);
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
                    this.onOptionSelect(option.value, option);
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
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        ${(props) => props.native
    ? styled_components_1.css `
                      z-index: 1;
                  `
    : styled_components_1.css `
                      pointer-events: none;
                      z-index: auto;
                  `};
    `;
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "toggleMenu", null);
tslib_1.__decorate([
    lodash_decorators_1.debounce(0),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "openMenu", null);
tslib_1.__decorate([
    lodash_decorators_1.debounce(0),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "closeMenu", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "cleanBlindText", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "findOptionIndex", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
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
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyDown", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyUp", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onContainerRef", null);
exports.Select = Select;
//# sourceMappingURL=index.js.map