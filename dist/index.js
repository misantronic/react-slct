import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Value } from './value';
import { Menu } from './menu';
import { toString, isArray, keys, getWindow, getDocument } from './utils';
export { Menu };
export class Select extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nativeSelect = React.createRef();
        this.container = React.createRef();
        this.state = {
            open: false,
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
                { label: `Create "${search}"`, value: 'CREATE' },
                ...options
            ];
        }
        return options;
    }
    get window() {
        return getWindow();
    }
    get document() {
        return getDocument();
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
    componentDidUpdate(_, prevState) {
        if (prevState.open && !this.state.open) {
            this.removeScrollListener();
            this.removeResizeListener();
        }
        if (!prevState.open && this.state.open) {
            this.addScrollListener();
            this.addResizeListener();
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
        const { open, search, rect, selectedIndex } = this.state;
        const searchable = this.props.searchable || creatable;
        return (React.createElement(Container, { className: className ? `react-slct ${className}` : 'react-slct', disabled: disabled, innerRef: this.container, onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, options: options, placeholder: placeholder, value: value, search: search, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onOptionRemove: this.onOptionRemove }),
            React.createElement(Menu, { open: open, options: this.options, rect: rect, value: value, multi: multi, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const clearable = this.props.clearable && native;
        const value = multi
            ? (this.props.value || []).map(val => toString(val))
            : toString(this.props.value || '');
        return (React.createElement(NativeSelect, { innerRef: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            this.options.map(option => {
                const value = toString(option.value);
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
        const selectedIndex = this.options.findIndex(option => toString(option.value) === toString(this.props.value));
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
    }
    onOptionSelect(value) {
        const { current } = this.nativeSelect;
        const { onChange } = this.props;
        if (current) {
            current.value = isArray(value)
                ? value.map(val => toString(val))
                : toString(value);
        }
        this.closeMenu(() => onChange && onChange(value));
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
    onDocumentClick() {
        this.closeMenu();
    }
    onKeyDown({ keyCode }) {
        switch (keyCode) {
            case keys.TAB:
                if (this.state.open) {
                    this.closeMenu();
                }
                break;
        }
    }
    onKeyUp({ keyCode }) {
        const { search, open } = this.state;
        const { creatable, multi, value, onCreate } = this.props;
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
                const isCreatable = selectedIndex === 0 &&
                    creatable &&
                    this.options[0].value === 'CREATE';
                if (isCreatable && onCreate && search) {
                    this.closeMenu(() => onCreate(search));
                }
                else if (selectedIndex !== undefined) {
                    const newValue = this.options[selectedIndex].value;
                    this.onOptionSelect(multi ? [...value, newValue] : newValue);
                }
                break;
            case keys.ESC:
                if (open) {
                    this.closeMenu();
                }
                break;
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
    tslib_1.__metadata("design:paramtypes", [Object]),
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
    tslib_1.__metadata("design:paramtypes", []),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onScroll", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select.prototype, "onResize", null);
//# sourceMappingURL=index.js.map