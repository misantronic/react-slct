import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Value } from './value';
import { Menu } from './menu';
import { toString, isArray, keys, getWindow, getDocument } from './utils';
import {
    SelectProps,
    SelectState,
    MenuComponentProps,
    Option,
    Rect
} from './typings';

export { SelectProps, Menu, MenuComponentProps, Option };

export class Select extends React.PureComponent<SelectProps, SelectState> {
    private static Container = styled.div`
        display: flex;
        position: relative;
        cursor: default;
        width: 100%;
        box-sizing: border-box;
        pointer-events: ${(props: { disabled?: boolean }) =>
            props.disabled ? 'none' : 'auto'};
        opacity: ${(props: { disabled?: boolean }) =>
            props.disabled ? 0.75 : 1};
        user-select: none;
    `;

    private static NativeSelect = styled.select`
        display: block;
        z-index: ${(props: { native?: boolean }) =>
            props.native ? '1' : 'auto'};
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
    `;

    private nativeSelect: React.RefObject<HTMLSelectElement>;
    private container: React.RefObject<HTMLDivElement>;

    constructor(props: SelectProps) {
        super(props);

        this.nativeSelect = React.createRef();
        this.container = React.createRef();

        this.state = {
            open: false,
            rect: { left: 0, top: 0, width: 0, height: 0 }
        };
    }

    private get options(): Option[] {
        const { search } = this.state;
        const { creatable } = this.props;
        let options = this.props.options;
        const showCreate =
            Boolean(creatable && search) &&
            !options.some(option => option.value === search);

        if (search) {
            options = options.filter(option =>
                option.label.toLowerCase().startsWith(search.toLowerCase())
            );
        }

        if (showCreate) {
            options = [
                { label: `Create "${search}"`, value: search, creatable: true },
                ...options
            ];
        }

        return options;
    }

    private get window() {
        return getWindow();
    }

    private get document() {
        return getDocument();
    }

    private get rect(): Rect {
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

    private optionIsCreatable(option: Option): boolean {
        return (
            this.props.creatable &&
            option.creatable &&
            Boolean(this.props.onCreate && this.state.search)
        );
    }

    public componentDidUpdate(_, prevState: SelectState): void {
        if (prevState.open && !this.state.open) {
            this.removeScrollListener();
            this.removeResizeListener();
        }

        if (!prevState.open && this.state.open) {
            this.addScrollListener();
            this.addResizeListener();
        }
    }

    public componentWillUnmount(): void {
        this.removeDocumentListener();
        this.removeScrollListener();
        this.removeResizeListener();
    }

    public render(): React.ReactNode {
        const { Container } = Select;
        const {
            className,
            options,
            creatable,
            clearable,
            placeholder,
            value,
            disabled,
            menuComponent,
            labelComponent,
            optionComponent,
            valueComponentSingle,
            valueComponentMulti,
            multi,
            native
        } = this.props;
        const { open, search, rect, selectedIndex } = this.state;
        const searchable = this.props.searchable || creatable;

        return (
            <Container
                className={className ? `react-slct ${className}` : 'react-slct'}
                disabled={disabled}
                innerRef={this.container}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
            >
                {this.renderNativeSelect()}
                <Value
                    clearable={clearable}
                    searchable={searchable}
                    open={open}
                    disabled={disabled}
                    multi={multi}
                    mobile={native}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                    search={search}
                    labelComponent={labelComponent}
                    valueComponentSingle={valueComponentSingle}
                    valueComponentMulti={valueComponentMulti}
                    onClear={this.onClear}
                    onClick={this.toggleMenu}
                    onSearch={this.onSearch}
                    onSearchFocus={this.onSearchFocus}
                    onOptionRemove={this.onOptionRemove}
                />
                <Menu
                    open={open}
                    options={this.options}
                    rect={rect}
                    value={value}
                    multi={multi}
                    search={search}
                    selectedIndex={selectedIndex}
                    menuComponent={menuComponent}
                    labelComponent={labelComponent}
                    optionComponent={optionComponent}
                    onSelect={this.onOptionSelect}
                />
            </Container>
        );
    }

    private renderNativeSelect(): React.ReactNode {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const clearable = this.props.clearable && native;
        const value = multi
            ? (this.props.value || []).map(val => toString(val))
            : toString(this.props.value || '');

        return (
            <NativeSelect
                innerRef={this.nativeSelect}
                multiple={multi}
                value={value}
                disabled={disabled}
                native={native}
                tabIndex={-1}
                onChange={this.onChangeNativeSelect}
            >
                <option value="" disabled={!clearable}>
                    {placeholder}
                </option>
                {this.options.map(option => {
                    const value = toString(option.value);

                    return (
                        <option
                            disabled={option.disabled}
                            value={value}
                            key={value}
                        >
                            {option.label}
                        </option>
                    );
                })}
            </NativeSelect>
        );
    }

    @bind
    private toggleMenu(): void {
        const open = !this.state.open;

        if (open) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    private openMenu(): void {
        const rect = this.rect;
        const selectedIndex = this.options.findIndex(
            option => toString(option.value) === toString(this.props.value)
        );

        this.setState(
            { open: true, search: undefined, selectedIndex, rect },
            () => this.addDocumentListener()
        );
    }

    private closeMenu(callback = () => {}): void {
        this.removeDocumentListener();
        this.setState(
            {
                open: false,
                search: undefined,
                selectedIndex: undefined
            },
            callback
        );
    }

    private createOption(value: string): void {
        const { onCreate } = this.props;

        if (onCreate) {
            this.closeMenu(() => onCreate(value));
        }
    }

    private addDocumentListener(): void {
        if (this.document) {
            document.addEventListener('click', this.onDocumentClick);
        }
    }

    private removeDocumentListener(): void {
        if (this.document) {
            document.removeEventListener('click', this.onDocumentClick);
        }
    }

    private addScrollListener(): void {
        if (this.window) {
            this.window.addEventListener('scroll', this.onScroll, true);
        }
    }

    private removeScrollListener(): void {
        if (this.window) {
            this.window.removeEventListener('scroll', this.onScroll, true);
        }
    }

    private addResizeListener(): void {
        if (this.window) {
            this.window.addEventListener('resize', this.onResize, true);
        }
    }

    private removeResizeListener(): void {
        if (this.window) {
            this.window.removeEventListener('resize', this.onResize, true);
        }
    }

    @bind
    private onChangeNativeSelect(
        e: React.SyntheticEvent<HTMLSelectElement>
    ): void {
        const { onChange, multi } = this.props;
        const { currentTarget } = e;

        if (onChange) {
            if (currentTarget.value === '') {
                this.onClear();
            } else {
                const values = Array.from(currentTarget.selectedOptions).map(
                    htmlOption => this.options[htmlOption.index - 1].value
                );

                if (multi) {
                    onChange(values);
                } else {
                    onChange(values[0]);
                }
            }
        }
    }

    @bind
    private onSearchFocus(): void {
        if (!this.state.open && !this.props.native) {
            this.openMenu();
        }
    }

    @bind
    private onOptionSelect(value: any | any[]): void {
        const { current } = this.nativeSelect;
        const { onChange, creatable } = this.props;

        if (creatable) {
            const createValue = (val: any) => {
                const option = this.options.find(
                    option =>
                        this.optionIsCreatable(option) && option.value === val
                );

                if (option) {
                    this.createOption(option.value);
                }
            };

            if (isArray(value)) {
                value.map(createValue);
            } else {
                createValue(value);
            }
        }

        if (current) {
            current.value = isArray(value)
                ? (value.map(val => toString(val)) as any)
                : toString(value);
        }

        this.closeMenu(() => onChange && onChange(value));
    }

    @bind
    private onOptionRemove(value: any): void {
        if (isArray(this.props.value)) {
            const values = this.props.value.filter(
                val => toString(val) !== toString(value)
            );

            this.onOptionSelect(values);
        }
    }

    @bind
    private onClear(): void {
        this.onOptionSelect(this.props.multi ? [] : undefined);
    }

    @bind
    private onSearch(search: string): void {
        this.setState({ search }, () => {
            if (this.options.length === 1 || (this.props.creatable && search)) {
                this.setState({ selectedIndex: 0 });
            } else {
                this.setState({ selectedIndex: undefined });
            }

            if (this.props.onSearch) {
                this.props.onSearch(search);
            }
        });
    }

    @bind
    private onDocumentClick(): void {
        this.closeMenu();
    }

    @bind
    private onKeyDown({ keyCode }: React.KeyboardEvent): void {
        switch (keyCode) {
            case keys.TAB:
                if (this.state.open) {
                    this.closeMenu();
                }
                break;
        }
    }

    @bind
    private onKeyUp({ keyCode }: React.KeyboardEvent): void {
        const { search, open } = this.state;
        const { multi, value } = this.props;
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
                } else {
                    this.openMenu();
                }
                break;
            case keys.ARROW_DOWN:
                if (open) {
                    if (
                        selectedIndex === undefined ||
                        selectedIndex === this.options.length - 1
                    ) {
                        selectedIndex = 0;
                    } else {
                        selectedIndex = selectedIndex + 1;
                    }

                    this.setState({ selectedIndex });
                } else {
                    this.openMenu();
                }
                break;
            case keys.ENTER:
                if (
                    this.state.selectedIndex === 0 &&
                    this.optionIsCreatable(this.options[0])
                ) {
                    this.createOption(search!);
                } else if (selectedIndex !== undefined) {
                    const newValue = this.options[selectedIndex].value;

                    this.onOptionSelect(
                        multi ? [...value, newValue] : newValue
                    );
                }
                break;
            case keys.ESC:
                if (open) {
                    this.closeMenu();
                }
                break;
        }
    }

    private allowRectChange(e): boolean {
        if (this.state.open) {
            if (
                e.target &&
                e.target.classList &&
                e.target.classList.contains('react-slct-menu-list')
            ) {
                return false;
            }

            return true;
        }

        return false;
    }

    @bind
    private onScroll(e): void {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }

    @bind
    private onResize(e): void {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }
}
