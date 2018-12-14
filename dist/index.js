import * as tslib_1 from "tslib";
import { bind, debounce } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Value } from './value';
import { Menu, MenuContainer } from './menu';
import { toString, isArray, keys, getDocument, getValueOptions } from './utils';
import './global-stylings';
export { Menu, keys };
export class Select extends React.PureComponent {
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
        return getDocument();
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
        const { className, options, creatable, clearable, placeholder, value, disabled, error, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, arrowComponent, multi, native, emptyText, rowHeight } = this.props;
        const { open, search, selectedIndex, focused } = this.state;
        const searchable = this.props.searchable || creatable;
        if (this.props.children) {
            return this.renderChildren();
        }
        const classNames = [
            'react-slct',
            className,
            error && 'has-error'
        ].filter(c => Boolean(c));
        return (React.createElement(Container, { className: classNames.join(' '), disabled: disabled, ref: this.onContainerRef, onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: options, placeholder: placeholder, error: error, value: value, search: search, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, arrowComponent: arrowComponent, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onSearchBlur: this.onSearchBlur, onOptionRemove: this.onOptionRemove }),
            React.createElement(Menu, { open: open, options: this.options, value: value, multi: multi, error: error, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, emptyText: emptyText, rowHeight: rowHeight, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const clearable = this.props.clearable && native;
        const value = isArray(this.props.value)
            ? this.props.value.map(val => toString(val))
            : toString(this.props.value || '');
        return (React.createElement(NativeSelect, { ref: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            this.options.map(option => {
                const value = toString(option.value);
                return (React.createElement("option", { disabled: option.disabled, value: value, key: value }, option.label));
            })));
    }
    renderChildren() {
        const { options, placeholder, multi, children } = this.props;
        const { open, search } = this.state;
        const valueOptions = getValueOptions(options || [], this.props.value);
        const value = !multi
            ? this.props.value
            : valueOptions.map(option => option.value);
        const showPlaceholder = !search &&
            (isArray(value)
                ? value.length === 0
                : value === undefined || value === null);
        if (!children) {
            return null;
        }
        return children({
            options: this.options,
            open,
            value,
            MenuContainer,
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
        const selectedIndex = this.options.findIndex(option => toString(option.value) === toString(this.props.value));
        this.setState({ open: true, search: undefined, selectedIndex }, () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
            this.addDocumentListener();
        });
    }
    closeMenu(callback = () => { }) {
        this.removeDocumentListener();
        this.setState({
            open: false,
            search: undefined,
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
        const { onChange, creatable } = this.props;
        let optionWasCreated = false;
        const selectOnNative = () => {
            if (current) {
                current.value = isArray(value)
                    ? value.map(val => toString(val))
                    : toString(value);
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
            if (isArray(value)) {
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
        if (isArray(this.props.value)) {
            const values = this.props.value.filter(val => toString(val) !== toString(value));
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
            case keys.TAB:
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
            case keys.ARROW_UP:
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
            case keys.ARROW_DOWN:
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
            case keys.ENTER:
                if (this.state.selectedIndex === 0 &&
                    this.optionIsCreatable(this.options[0])) {
                    this.createOption(search);
                }
                else if (selectedIndex !== undefined &&
                    this.options[selectedIndex]) {
                    const newValue = this.options[selectedIndex].value;
                    this.onOptionSelect(isArray(value) ? [...value, newValue] : newValue);
                }
                break;
            case keys.ESC:
                if (open) {
                    this.closeMenu();
                }
                break;
        }
    }
    handleBlindText(keyCode) {
        const { blindText } = this.state;
        if (keyCode === keys.BACKSPACE && blindText.length) {
            clearTimeout(this.blindTextTimeout);
            this.setState({
                blindText: blindText.slice(0, blindText.length - 1)
            }, this.cleanBlindText);
        }
        else if (keyCode === keys.SPACE) {
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
Select.Container = styled.div `
        display: flex;
        position: relative;
        cursor: default;
        width: 100%;
        box-sizing: border-box;
        pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
        opacity: ${(props) => props.disabled ? 0.75 : 1};
        user-select: none;
    `;
Select.NativeSelect = styled.select `
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
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "toggleMenu", null);
tslib_1.__decorate([
    debounce(0),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "openMenu", null);
tslib_1.__decorate([
    debounce(0),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "closeMenu", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "cleanBlindText", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onChangeNativeSelect", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearchFocus", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearchBlur", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onOptionSelect", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onOptionRemove", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onClear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onSearch", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onDocumentClick", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyDown", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onKeyUp", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [HTMLDivElement]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onContainerRef", null);
//# sourceMappingURL=index.js.map