import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Value } from './value';
import { Options } from './options';
import { toString, isArray, keys } from './utils';
export class Select2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.rect = { left: 0, top: 0, width: 0, height: 0 };
        this.nativeSelect = React.createRef();
        this.container = React.createRef();
        this.state = {
            open: false
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
    componentWillUnmount() {
        this.removeDocumentListener();
    }
    render() {
        const { Container } = Select2;
        const { className, options, creatable, clearable, placeholder, value, disabled, labelComponent, multi, native } = this.props;
        const { open, search, selectedIndex } = this.state;
        const searchable = this.props.searchable || creatable;
        return (React.createElement(Container, { className: className, disabled: disabled, innerRef: this.container, onKeyUp: this.onKeyUp, onKeyDown: this.onKeyDown },
            this.renderNativeSelect(),
            React.createElement(Value, { clearable: clearable, searchable: searchable, open: open, multi: multi, mobile: native, options: options, placeholder: placeholder, value: value, search: search, labelComponent: labelComponent, onClear: this.onClear, onClick: this.toggleMenu, onSearch: this.onSearch, onSearchFocus: this.onSearchFocus, onOptionRemove: this.onOptionRemove }),
            React.createElement(Options, { open: open, options: this.options, rect: this.rect, value: value, multi: multi, search: search, selectedIndex: selectedIndex, labelComponent: labelComponent, onSelect: this.onOptionSelect })));
    }
    renderNativeSelect() {
        const { NativeSelect } = Select2;
        const { native, placeholder, multi, disabled } = this.props;
        const value = multi
            ? (this.props.value || []).map(val => toString(val))
            : toString(this.props.value || '');
        return (React.createElement(NativeSelect, { innerRef: this.nativeSelect, multiple: multi, value: value, disabled: disabled, native: native, tabIndex: -1, onChange: this.onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: true }, placeholder),
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
        let selectedIndex = this.state.selectedIndex;
        if (this.container.current) {
            const rect = this.container.current.getBoundingClientRect();
            this.rect.left = rect.left;
            this.rect.top = rect.top;
            this.rect.width = rect.width;
            this.rect.height = rect.height;
            selectedIndex = this.options.findIndex(option => toString(option.value) === toString(this.props.value));
        }
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
    addDocumentListener() {
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this.onDocumentClick);
        }
    }
    removeDocumentListener() {
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', this.onDocumentClick);
        }
    }
    onChangeNativeSelect(e) {
        const { onChange } = this.props;
        if (onChange) {
            const values = Array.from(e.currentTarget.selectedOptions).map(htmlOption => this.options[htmlOption.index - 1].value);
            onChange(values.length === 1 ? values[0] : values);
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
        this.onOptionSelect(undefined);
    }
    onSearch(search) {
        this.setState({ search }, () => {
            if (this.options.length === 1 || (this.props.creatable && search)) {
                this.setState({ selectedIndex: 0 });
            }
            else {
                this.setState({ selectedIndex: undefined });
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
                            selectedIndex = undefined;
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
                    if (selectedIndex === undefined) {
                        selectedIndex = 0;
                    }
                    else {
                        selectedIndex = selectedIndex + 1;
                    }
                    if (selectedIndex >= this.options.length) {
                        selectedIndex = undefined;
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
}
Select2.Container = styled.div `
        display: flex;
        position: relative;
        cursor: default;
        width: 100%;
        pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
        opacity: ${(props) => props.disabled ? 0.75 : 1};
    `;
Select2.NativeSelect = styled.select `
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
], Select2.prototype, "toggleMenu", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onChangeNativeSelect", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onSearchFocus", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onOptionSelect", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onOptionRemove", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onClear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onSearch", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onDocumentClick", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onKeyDown", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Select2.prototype, "onKeyUp", null);
//# sourceMappingURL=index.js.map