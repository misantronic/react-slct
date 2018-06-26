import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, keys, isArray } from './utils';
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
    transform: translateY(-1px) scaleY(0.8);

    &:hover {
        color: #333;
    }
`;
const ValueContainer = styled.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-height: ${(props) => props.mobile ? '42px' : '32px'};
    pointer-events: ${(props) => props.mobile ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border: 1px solid #ccc;
    z-index: 0;
`;
const ValueLeft = styled.div `
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    user-select: none;
    min-width: 0;
    margin: ${(props) => (props.multi ? '-2px -5px' : 0)};
`;
const ValueRight = styled.div `
    margin-left: 4px;
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

    &:focus {
        outline: none;
    }
`;
const TagLabel = styled.span `
    display: table-cell;
    padding: 0px 3px;
    background-color: rgba(0, 126, 255, 0.08);
    border-radius: 2px;
    border: 1px solid rgba(0, 126, 255, 0.24);
    color: #007eff;
    font-size: 0.9em;
    line-height: 1.4;
    margin: 3px;
    vertical-align: middle;
`;
const StyledTagRemove = styled.button `
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
class TagRemove extends React.PureComponent {
    render() {
        return (React.createElement(StyledTagRemove, { className: "remove", tabIndex: -1, onClick: this.onClick }, "\u00D7"));
    }
    onClick(e) {
        e.stopPropagation();
        this.props.onClick(this.props.value);
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TagRemove.prototype, "onClick", null);
export class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.search = React.createRef();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.search && !this.props.search && this.search.current) {
            this.search.current.innerText = '';
        }
    }
    render() {
        const { options, value, clearable, open, mobile, multi } = this.props;
        const valueOptions = options.filter(option => {
            if (isArray(value)) {
                return value.some(val => toString(option.value) === toString(val));
            }
            else {
                return toString(option.value) === toString(value);
            }
        });
        const showClearer = Boolean(clearable && valueOptions.length);
        return (React.createElement(ValueContainer, { className: "value-container", mobile: mobile, onClick: this.onClick },
            React.createElement(ValueLeft, { className: "value-left", multi: multi },
                !multi && this.renderSearch(),
                this.renderValues(valueOptions),
                multi && this.renderSearch()),
            React.createElement(ValueRight, { className: "value-right" },
                showClearer && (React.createElement(Clearer, { tabIndex: -1, className: "clearer", onClick: this.onClear }, "\u00D7")),
                React.createElement(ArrowButton, { className: "arrow", tabIndex: -1 }, open ? '▲' : '▼'))));
    }
    renderSearch() {
        const { open, searchable, multi, onSearchFocus } = this.props;
        const canSearch = open && searchable;
        return (React.createElement(Search, { className: "search", contentEditable: true, multi: multi, canSearch: canSearch, onInput: this.onSearch, onKeyDown: this.onKeyDown, onFocus: onSearchFocus, innerRef: this.search }));
    }
    renderValues(valueOptions) {
        const { placeholder, search, labelComponent, multi } = this.props;
        const Label = labelComponent || (multi ? TagLabel : SelectLabel);
        if (search && !multi) {
            return null;
        }
        if (valueOptions.length === 0) {
            return React.createElement(Placeholder, null, placeholder);
        }
        return valueOptions.map(option => (React.createElement(Label, Object.assign({ className: "value", key: toString(option.value) }, option),
            multi && (React.createElement(TagRemove, { value: option.value, onClick: this.props.onOptionRemove }, "\u00D7")),
            option.label)));
    }
    onClick() {
        if (this.search.current) {
            this.search.current.focus();
        }
        this.props.onClick();
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
    onSearch(e) {
        this.props.onSearch(e.currentTarget.innerText.trim());
    }
    onKeyDown(e) {
        const { open, searchable } = this.props;
        if ((!open && !searchable) ||
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