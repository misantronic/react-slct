import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, keys, isArray } from './utils';
import { SelectProps, Option } from './typings';

export interface ValueProps {
    options: SelectProps['options'];
    value: SelectProps['value'];
    placeholder: SelectProps['placeholder'];
    clearable: SelectProps['clearable'];
    searchable: SelectProps['searchable'];
    labelComponent: SelectProps['labelComponent'];
    multi: SelectProps['multi'];
    mobile: SelectProps['native'];
    search?: string;
    open: boolean;
    onClear(): void;
    onClick(): void;
    onSearch(search: string): void;
    onSearchFocus(): void;
    onOptionRemove(value: any): void;
}

interface TagRemoveProps<T = any> {
    value: T;
    onClick(value: T): void;
}

interface SearchProps {
    canSearch?: boolean;
    multi?: boolean;
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
    transform: translateY(-1px) scaleY(0.8);

    &:hover {
        color: #333;
    }
`;

const ValueContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-height: ${(props: { mobile?: boolean }) =>
        props.mobile ? '42px' : '32px'};
    pointer-events: ${(props: { mobile?: boolean }) =>
        props.mobile ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border: 1px solid #ccc;
    z-index: 0;
`;

const ValueLeft = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    user-select: none;
    min-width: 0;
    margin: ${(props: { multi?: boolean }) => (props.multi ? '-2px -5px' : 0)};
`;

const ValueRight = styled.div`
    margin-left: 4px;
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

    &:focus {
        outline: none;
    }
`;

const TagLabel = styled.span`
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

const StyledTagRemove = styled.button`
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

class TagRemove extends React.PureComponent<TagRemoveProps> {
    public render(): React.ReactNode {
        return (
            <StyledTagRemove
                className="remove"
                tabIndex={-1}
                onClick={this.onClick}
            >
                ×
            </StyledTagRemove>
        );
    }

    @bind
    private onClick(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClick(this.props.value);
    }
}

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
    }

    public render(): React.ReactNode {
        const { options, value, clearable, open, mobile, multi } = this.props;
        const valueOptions = options.filter(option => {
            if (isArray(value)) {
                return value.some(
                    val => toString(option.value) === toString(val)
                );
            } else {
                return toString(option.value) === toString(value);
            }
        });
        const showClearer = Boolean(clearable && valueOptions.length);

        return (
            <ValueContainer
                className="value-container"
                mobile={mobile}
                onClick={this.onClick}
            >
                <ValueLeft className="value-left" multi={multi}>
                    {!multi && this.renderSearch()}
                    {this.renderValues(valueOptions)}
                    {multi && this.renderSearch()}
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
        const { open, searchable, multi, onSearchFocus } = this.props;
        const canSearch = open && searchable;

        return (
            <Search
                className="search"
                contentEditable
                multi={multi}
                canSearch={canSearch}
                onInput={this.onSearch}
                onKeyDown={this.onKeyDown}
                onFocus={onSearchFocus}
                innerRef={this.search}
            />
        );
    }

    private renderValues(valueOptions: Option[]): React.ReactNode {
        const { placeholder, search, labelComponent, multi } = this.props;
        const Label = labelComponent || (multi ? TagLabel : SelectLabel);

        if (search && !multi) {
            return null;
        }

        if (valueOptions.length === 0) {
            return <Placeholder>{placeholder}</Placeholder>;
        }

        return valueOptions.map(option => (
            <Label className="value" key={toString(option.value)} {...option}>
                {multi && (
                    <TagRemove
                        value={option.value}
                        onClick={this.props.onOptionRemove}
                    >
                        ×
                    </TagRemove>
                )}
                {option.label}
            </Label>
        ));
    }

    @bind
    private onClick(): void {
        if (this.search.current) {
            this.search.current.focus();
        }

        this.props.onClick();
    }

    @bind
    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClear();
    }

    @bind
    private onSearch(e: React.SyntheticEvent<HTMLSpanElement>) {
        this.props.onSearch(e.currentTarget.innerText.trim());
    }

    @bind
    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
        const { open, searchable } = this.props;

        if (
            (!open && !searchable) ||
            e.keyCode === keys.ENTER ||
            e.keyCode === keys.ARROW_UP ||
            e.keyCode === keys.ARROW_DOWN
        ) {
            e.preventDefault();
        }
    }
}
