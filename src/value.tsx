import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { SelectLabel } from './label';
import { keys, getValueOptions, getWindow, toKey } from './utils';
import { SelectProps, Option } from './typings';
import { ValueComponentMulti } from './value-component-multi';
import { ValueComponentSingle } from './value-component-single';

export interface ValueProps {
    options: SelectProps['options'];
    value: SelectProps['value'];
    placeholder: SelectProps['placeholder'];
    clearable: SelectProps['clearable'];
    searchable: SelectProps['searchable'];
    labelComponent: SelectProps['labelComponent'];
    valueComponentSingle: SelectProps['valueComponentSingle'];
    valueComponentMulti: SelectProps['valueComponentMulti'];
    arrowComponent: SelectProps['arrowComponent'];
    clearComponent: SelectProps['clearComponent'];
    multi: SelectProps['multi'];
    mobile: SelectProps['native'];
    disabled: SelectProps['disabled'];
    error: SelectProps['error'];
    equalCompareProp: SelectProps['equalCompareProp'];
    search?: string;
    keepSearchOnBlur?: boolean;
    open: boolean;
    focused?: boolean;
    onClear(): void;
    onClick(): void;
    onSearch(search: string): void;
    onSearchFocus(): void;
    onSearchBlur(): void;
    onOptionRemove(value: any): void;
}

interface SearchProps {
    canSearch?: boolean;
}

interface ValueContainerProps {
    mobile?: boolean;
    disabled?: boolean;
    focused?: boolean;
    error?: boolean;
}

interface ValueLeftProps {
    multi?: boolean;
    hasValue?: boolean;
}

const Button = styled.button`
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

const ArrowButton = styled(Button)`
    font-size: 12px;
    color: #ccc;
    transform: translateY(2px);

    &:hover {
        color: #333;
    }
`;

const ValueContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-height: 32px;
    pointer-events: ${(props: ValueContainerProps) =>
        props.mobile || props.disabled ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props: ValueContainerProps) =>
        props.error ? 'var(--react-slct-error-color)' : '#ccc'};
    z-index: 0;
    box-sizing: border-box;
    max-width: 100%;
    box-shadow: ${(props: ValueContainerProps) =>
        props.focused ? 'rgba(0, 0, 0, 0.15) 0 0 2px' : 'none'};
`;

const ValueLeft = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: ${(props: ValueLeftProps) =>
        props.multi && props.hasValue ? 'wrap' : 'nowrap'};
    user-select: none;
    min-width: 0;
    box-sizing: border-box;
    margin: ${(props: ValueLeftProps) =>
        props.multi && props.hasValue ? '-2px -5px' : 0};
`;

const ValueRight = styled.div`
    display: flex;
    align-items: center;
    margin-left: 4px;
    box-sizing: border-box;
`;

const Placeholder = styled(SelectLabel)`
    color: #aaa;
`;

const ClearButton = styled(Button)`
    margin-right: 6px;
`;

const ClearContainer = styled.span`
    color: #ccc;

    &:hover {
        color: #333;
    }
`;

const ClearX = () => <ClearContainer>×</ClearContainer>;

const Search = styled.span`
    min-width: 1px;
    margin-left: -1px;
    top: 1px;
    height: 16px;
    user-select: text;

    ${(props: SearchProps) =>
        props.canSearch
            ? css`
                  opacity: 1;
                  position: relative;
                  top: 1px;
                  left: 1px;
              `
            : css`
                  position: absolute;
                  opacity: 0;
              `}

    &:focus {
        outline: none;
    }
`;

export class Value extends React.PureComponent<ValueProps> {
    search: React.RefObject<HTMLSpanElement>;

    constructor(props: ValueProps) {
        super(props);

        this.search = React.createRef();

        const window = getWindow();

        if (window) {
            window.addEventListener('blur', this.blur);
        }
    }

    public componentDidUpdate(prevProps: ValueProps): void {
        if (prevProps.search && !this.props.search && this.search.current) {
            this.search.current.innerText = '';
        }

        if (prevProps.focused !== this.props.focused && this.props.focused) {
            this.focus();
        }
    }

    public render(): React.ReactNode {
        const {
            options = [],
            value,
            disabled,
            clearable,
            open,
            mobile,
            multi,
            focused,
            equalCompareProp,
            error,
        } = this.props;
        const ArrowComponent = this.props.arrowComponent;
        const ClearComponent = this.props.clearComponent || ClearX;
        const valueOptions = getValueOptions(
            options,
            value,
            multi,
            equalCompareProp
        );
        const showClearer = Boolean(
            clearable && valueOptions.length && !mobile
        );
        const searchAtStart = !multi || valueOptions.length === 0;
        const searchAtEnd = multi && valueOptions.length > 0;

        return (
            <ValueContainer
                data-role="value"
                className="react-slct-value"
                disabled={disabled}
                mobile={mobile}
                focused={focused}
                error={error}
                onClick={this.onClick}
            >
                <ValueLeft
                    className="value-left"
                    multi={multi}
                    hasValue={!!valueOptions.length}
                >
                    {searchAtStart && this.renderSearch()}
                    {this.renderValues(valueOptions)}
                    {searchAtEnd && this.renderSearch()}
                </ValueLeft>
                <ValueRight className="value-right">
                    {showClearer && (
                        <ClearButton
                            type="button"
                            tabIndex={-1}
                            className="clearer"
                            onClick={this.onClear}
                        >
                            <ClearComponent />
                        </ClearButton>
                    )}
                    <ArrowButton type="button" className="arrow" tabIndex={-1}>
                        {ArrowComponent ? (
                            <ArrowComponent open={open} />
                        ) : open ? (
                            '▲'
                        ) : (
                            '▼'
                        )}
                    </ArrowButton>
                </ValueRight>
            </ValueContainer>
        );
    }

    private renderSearch(): React.ReactNode {
        const {
            open,
            value,
            disabled,
            searchable,
            search,
            keepSearchOnBlur,
            onSearchFocus,
            onSearchBlur,
        } = this.props;
        const canSearch =
            (open && searchable) ||
            (keepSearchOnBlur && !value && searchable) ||
            Boolean(search);

        if (disabled && !keepSearchOnBlur) {
            return null;
        }

        return (
            <Search
                className="search"
                contentEditable
                canSearch={canSearch}
                onInput={this.onSearch}
                onKeyDown={this.onKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                ref={this.search as any}
            />
        );
    }

    private renderValues(valueOptions: Option[]): React.ReactNode {
        const {
            placeholder,
            search,
            labelComponent,
            valueComponentSingle,
            valueComponentMulti,
            multi,
            open,
        } = this.props;

        if (search && open && !multi) {
            return null;
        }

        if (valueOptions.length === 0 && !search) {
            return <Placeholder>{placeholder}</Placeholder>;
        }

        const Single = valueComponentSingle || ValueComponentSingle;
        const Multi = (valueComponentMulti || ValueComponentMulti) as any;

        return valueOptions.map((option) =>
            multi ? (
                <Multi
                    key={toKey(option.value, this.props.equalCompareProp)}
                    option={option}
                    labelComponent={labelComponent}
                    options={valueOptions}
                    onRemove={this.props.onOptionRemove}
                />
            ) : (
                <Single
                    key={toKey(option.value, this.props.equalCompareProp)}
                    option={option}
                    labelComponent={labelComponent}
                />
            )
        );
    }

    private focus(): void {
        const el = this.search.current;

        if (el) {
            el.focus();

            if (
                typeof window.getSelection != 'undefined' &&
                typeof document.createRange != 'undefined'
            ) {
                const range = document.createRange();
                const sel = window.getSelection();

                range.selectNodeContents(el);
                range.collapse(false);

                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }

    @bind
    private blur(): void {
        if (this.search.current) {
            this.search.current.blur();
        }
    }

    @bind
    private onClick(): void {
        if (!this.props.disabled) {
            this.focus();
            this.props.onClick();
        }
    }

    @bind
    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClear();
    }

    @bind
    private onSearch(e: React.KeyboardEvent<HTMLSpanElement>) {
        if (this.props.searchable) {
            this.props.onSearch(e.currentTarget.innerText.trim());
        } else {
            e.preventDefault();
        }
    }

    @bind
    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
        const { searchable } = this.props;

        if (e.metaKey) {
            return;
        }

        if (
            (!searchable && e.keyCode !== keys.TAB) ||
            e.keyCode === keys.ENTER ||
            e.keyCode === keys.ARROW_UP ||
            e.keyCode === keys.ARROW_DOWN
        ) {
            e.preventDefault();
        }
    }
}
