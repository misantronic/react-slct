import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, keys, getValueOptions } from './utils';
import { ValueComponentMulti } from './value-component-multi';
import { ValueComponentSingle } from './value-component-single';
const Button = styled.button `
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
const ArrowButton = styled(Button) `
    font-size: 12px;
    color: #ccc;
    transform: translateY(2px);

    &:hover {
        color: #333;
    }
`;
const ValueContainer = styled.div `
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
const ValueLeft = styled.div `
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: ${(props) => props.multi && props.hasValue ? 'wrap' : 'nowrap'};
    user-select: none;
    min-width: 0;
    box-sizing: border-box;
    margin: ${(props) => (props.multi ? '-2px -5px' : 0)};
`;
const ValueRight = styled.div `
    display: flex;
    align-items: center;
    margin-left: 4px;
    box-sizing: border-box;
`;
const Placeholder = styled(SelectLabel) `
    color: #aaa;
`;
const Clearer = styled(Button) `
    margin-right: 6px;
    color: #ccc;

    &:hover {
        color: #333;
    }
`;
const Search = styled.span `
    min-width: 1px;
    margin-left: ${(props) => (props.multi ? '4px' : '-1px')};
    height: 16px;
    opacity: ${(props) => (props.canSearch ? 1 : 0)};
    user-select: text;

    &:focus {
        outline: none;
    }
`;
export class Value extends React.PureComponent {
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
        const valueOptions = getValueOptions(options, value);
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
        const Single = valueComponentSingle || ValueComponentSingle;
        const Multi = valueComponentMulti || ValueComponentMulti;
        return valueOptions.map(option => multi ? (React.createElement(Multi, { key: toString(option.value), option: option, labelComponent: labelComponent, onRemove: this.props.onOptionRemove })) : (React.createElement(Single, { key: toString(option.value), option: option, labelComponent: labelComponent })));
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
        if ((!searchable && e.keyCode !== keys.TAB) ||
            e.keyCode === keys.ENTER ||
            e.keyCode === keys.ARROW_UP ||
            e.keyCode === keys.ARROW_DOWN) {
            e.preventDefault();
        }
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onClick", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onClear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onSearch", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onKeyDown", null);
//# sourceMappingURL=value.js.map