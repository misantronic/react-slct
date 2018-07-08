import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, keys, getValueOptions } from './utils';
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
    multi: SelectProps['multi'];
    mobile: SelectProps['native'];
    disabled: SelectProps['disabled'];
    search?: string;
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
    multi?: boolean;
}

interface ValueContainerProps {
    mobile?: boolean;
    disabled?: boolean;
    focused?: boolean;
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
    min-height: ${(props: ValueContainerProps) =>
        props.mobile ? '42px' : '32px'};
    pointer-events: ${(props: ValueContainerProps) =>
        props.mobile || props.disabled ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border: 1px solid #ccc;
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
    margin: ${(props: ValueLeftProps) => (props.multi ? '-2px -5px' : 0)};
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

const Clearer = styled(Button)`
    margin-right: 6px;
    color: #ccc;

    &:hover {
        color: #333;
    }
`;

const Search = styled.span`
    min-width: 1px;
    margin-left: ${(props: SearchProps) => (props.multi ? '4px' : '-1px')};
    height: 16px;
    opacity: ${(props: SearchProps) => (props.canSearch ? 1 : 0)};
    user-select: text;

    &:focus {
        outline: none;
    }
`;

export class Value extends React.PureComponent<ValueProps> {
    search: React.RefObject<HTMLSpanElement>;

    constructor(props: ValueProps) {
        super(props);

        this.search = React.createRef();
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
            focused
        } = this.props;
        const valueOptions = getValueOptions(options, value);
        const showClearer = Boolean(
            clearable && valueOptions.length && !mobile
        );
        const searchAtStart = !multi || valueOptions.length === 0;
        const searchAtEnd = multi && valueOptions.length > 0;

        return (
            <ValueContainer
                className="value-container"
                disabled={disabled}
                mobile={mobile}
                focused={focused}
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
                        <Clearer
                            tabIndex={-1}
                            className="clearer"
                            onClick={this.onClear}
                        >
                            ×
                        </Clearer>
                    )}
                    <ArrowButton className="arrow" tabIndex={-1}>
                        {open ? '▲' : '▼'}
                    </ArrowButton>
                </ValueRight>
            </ValueContainer>
        );
    }

    private renderSearch(): React.ReactNode {
        const {
            open,
            disabled,
            searchable,
            multi,
            onSearchFocus,
            onSearchBlur
        } = this.props;
        const canSearch = open && searchable;

        if (disabled) {
            return null;
        }

        return (
            <Search
                className="search"
                contentEditable
                multi={multi}
                canSearch={canSearch}
                onInput={this.onSearch}
                onKeyDown={this.onKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                innerRef={this.search}
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
            multi
        } = this.props;

        if (search && !multi) {
            return null;
        }

        if (valueOptions.length === 0 && !search) {
            return <Placeholder>{placeholder}</Placeholder>;
        }

        const Single = valueComponentSingle || ValueComponentSingle;
        const Multi = valueComponentMulti || ValueComponentMulti;

        return valueOptions.map(
            option =>
                multi ? (
                    <Multi
                        key={toString(option.value)}
                        option={option}
                        labelComponent={labelComponent}
                        onRemove={this.props.onOptionRemove}
                    />
                ) : (
                    <Single
                        key={toString(option.value)}
                        option={option}
                        labelComponent={labelComponent}
                    />
                )
        );
    }

    private focus(): void {
        if (this.search.current) {
            this.search.current.focus();
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
    private onSearch(e: React.SyntheticEvent<HTMLSpanElement>) {
        if (this.props.searchable) {
            this.props.onSearch(e.currentTarget.innerText.trim());
        } else {
            e.preventDefault();
        }
    }

    @bind
    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
        const { searchable } = this.props;

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
