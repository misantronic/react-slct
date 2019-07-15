import { bind, debounce } from 'lodash-decorators';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { Value } from './value';
import { Menu } from './menu';
import { MenuContainer } from './menu-container';
import {
    isArray,
    keys,
    getDocument,
    getValueOptions,
    equal,
    toKey
} from './utils';
import {
    SelectProps,
    SelectState,
    MenuComponentProps,
    LabelComponentProps,
    Option
} from './typings';
import './global-stylings';

export {
    SelectProps,
    Menu,
    MenuComponentProps,
    LabelComponentProps,
    Option,
    keys
};

export class Select<T = any> extends React.PureComponent<
    SelectProps<T>,
    SelectState
> {
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
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        ${(props: { native?: boolean }) =>
            props.native
                ? css`
                      z-index: 1;
                  `
                : css`
                      pointer-events: none;
                      z-index: auto;
                  `};
    `;

    private nativeSelect: React.RefObject<HTMLSelectElement>;
    private container: HTMLDivElement | null = null;
    private blindTextTimeout!: number;

    constructor(props: SelectProps) {
        super(props);

        this.nativeSelect = React.createRef();

        this.state = {
            open: false,
            blindText: ''
        };
    }

    private get options(): Option<T>[] {
        const { search } = this.state;
        const { creatable, onCreateText } = this.props;
        let options = this.props.options || [];
        const showCreate =
            creatable &&
            !options.some(option => option.value === (search as any));

        if (search) {
            options = options.filter(option =>
                option.label.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (showCreate && search) {
            options = [
                {
                    label: onCreateText
                        ? onCreateText(search)
                        : `Create "${search}"`,
                    value: search as any,
                    creatable: true
                },
                ...options
            ];
        }

        return options;
    }

    private get document() {
        return getDocument();
    }

    private optionIsCreatable(option: Option<T>): boolean {
        return (
            this.props.creatable &&
            option.creatable &&
            Boolean(this.props.onCreate && this.state.search)
        );
    }

    public componentDidUpdate(_, prevState: SelectState): void {
        if (
            this.state.blindText &&
            prevState.blindText !== this.state.blindText
        ) {
            this.handleBlindTextUpdate();
        }
    }

    public componentWillUnmount(): void {
        this.removeDocumentListener();
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
            error,
            menuComponent,
            labelComponent,
            optionComponent,
            valueComponentSingle,
            valueComponentMulti,
            arrowComponent,
            clearComponent,
            multi,
            native,
            emptyText,
            rowHeight,
            menuWidth,
            menuHeight,
            keepSearchOnBlur
        } = this.props;
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

        return (
            <Container
                className={classNames.join(' ')}
                disabled={disabled}
                ref={this.onContainerRef as any}
                data-role={this.props['data-role']}
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
                    focused={focused}
                    options={options}
                    placeholder={placeholder}
                    error={error}
                    value={value}
                    search={search}
                    keepSearchOnBlur={keepSearchOnBlur}
                    labelComponent={labelComponent}
                    valueComponentSingle={valueComponentSingle}
                    valueComponentMulti={valueComponentMulti}
                    arrowComponent={arrowComponent}
                    clearComponent={clearComponent}
                    onClear={this.onClear}
                    onClick={this.toggleMenu}
                    onSearch={this.onSearch}
                    onSearchFocus={this.onSearchFocus}
                    onSearchBlur={this.onSearchBlur}
                    onOptionRemove={this.onOptionRemove}
                />
                <Menu
                    open={open}
                    options={this.options}
                    value={value}
                    multi={multi}
                    error={error}
                    search={search}
                    selectedIndex={selectedIndex}
                    menuComponent={menuComponent}
                    labelComponent={labelComponent}
                    optionComponent={optionComponent}
                    emptyText={emptyText}
                    rowHeight={rowHeight}
                    menuWidth={menuWidth}
                    menuHeight={menuHeight}
                    onSelect={this.onOptionSelect}
                />
            </Container>
        );
    }

    private renderNativeSelect(): React.ReactNode {
        const { NativeSelect } = Select;
        const { native, placeholder, multi, disabled } = this.props;
        const dataRole = this.props['data-role']
            ? `select-${this.props['data-role']}`
            : undefined;
        const clearable = this.props.clearable && native;
        const value = isArray(this.props.value)
            ? this.props.value.map(this.findOptionIndex)
            : this.findOptionIndex(this.props.value || '');

        return (
            <NativeSelect
                ref={this.nativeSelect as any}
                multiple={multi}
                value={value}
                disabled={disabled}
                native={native}
                tabIndex={-1}
                data-role={dataRole}
                onChange={this.onChangeNativeSelect}
            >
                <option value="" disabled={!clearable}>
                    {placeholder}
                </option>
                {this.options.map((option, i) => (
                    <option
                        key={toKey(option.value)}
                        value={`${i}`}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </NativeSelect>
        );
    }

    private renderChildren(): React.ReactNode {
        const { options, placeholder, multi, children } = this.props;
        const { open, search } = this.state;
        const valueOptions = getValueOptions(options || [], this.props.value);
        const value: T | T[] | undefined = !multi
            ? this.props.value
            : valueOptions.map(option => option.value);
        const showPlaceholder =
            !search &&
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
            onClose: () => this.closeMenu(),
            onOpen: () => this.openMenu(),
            onRef: ref => (this.container = ref)
        });
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

    @debounce(0)
    private openMenu(): void {
        const selectedIndex = this.options.findIndex(option =>
            equal(option.value, this.props.value)
        );
        const keepSearchOnBlur =
            this.props.keepSearchOnBlur && !this.props.value;

        this.setState(
            {
                open: true,
                search: keepSearchOnBlur ? this.state.search : undefined,
                selectedIndex
            },
            () => {
                if (this.props.onOpen) {
                    this.props.onOpen();
                }

                this.addDocumentListener();
            }
        );
    }

    @debounce(0)
    private closeMenu(callback = () => {}): void {
        const keepSearchOnBlur =
            this.props.keepSearchOnBlur && !this.props.value;

        this.removeDocumentListener();
        this.setState(
            {
                open: false,
                search: keepSearchOnBlur ? this.state.search : undefined,
                selectedIndex: undefined
            },
            () => {
                if (this.props.onClose) {
                    this.props.onClose();
                }

                callback();
            }
        );
    }

    private createOption(value: string, cb?: () => void): void {
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

    private addDocumentListener(): void {
        this.removeDocumentListener();

        if (this.document) {
            this.document.addEventListener('click', this.onDocumentClick);
        }
    }

    private removeDocumentListener(): void {
        if (this.document) {
            this.document.removeEventListener('click', this.onDocumentClick);
        }
    }

    @bind
    private cleanBlindText(): void {
        this.blindTextTimeout = setTimeout(
            () => this.setState({ blindText: '' }),
            700
        );
    }

    @bind
    private findOptionIndex(val: any) {
        let index = this.options.findIndex(option => option.value === val);

        if (index === -1) {
            if (typeof val === 'object') {
                index = this.options.findIndex(option => {
                    if (typeof option.value === 'object') {
                        return (
                            JSON.stringify(option.value) === JSON.stringify(val)
                        );
                    }

                    return false;
                });
            }

            if (index === -1) {
                return '';
            }
        }

        return String(index);
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
                    onChange(values as any);
                } else {
                    onChange(values[0] as any);
                }
            }
        }
    }

    @bind
    private onSearchFocus(): void {
        const { open, focused } = this.state;

        if (!open && !focused && !this.props.native) {
            this.openMenu();
        }

        this.setState({ focused: true });
    }

    @bind
    private onSearchBlur(): void {
        this.setState({ focused: false });
    }

    @bind
    private onOptionSelect(value: any | any[], option?: Option<T>): void {
        const { current } = this.nativeSelect;
        const { onChange, creatable } = this.props;
        let optionWasCreated = false;

        const selectOnNative = () => {
            if (current) {
                current.value = isArray(value)
                    ? (value.map(this.findOptionIndex) as any)
                    : this.findOptionIndex(value);
            }

            this.setState({ focused: true }, () =>
                this.closeMenu(() => onChange && onChange(value, option))
            );
        };

        if (creatable) {
            const createValue = (val: any) => {
                const option = this.options.find(
                    option =>
                        this.optionIsCreatable(option) && option.value === val
                );

                if (option) {
                    optionWasCreated = true;
                    this.createOption(option.value as any, selectOnNative);
                }
            };

            if (isArray(value)) {
                value.map(createValue);
            } else {
                createValue(value);
            }
        }

        if (!optionWasCreated) {
            selectOnNative();
        }
    }

    @bind
    private onOptionRemove(value: any): void {
        if (isArray(this.props.value)) {
            const values = this.props.value.filter(val => !equal(val, value));

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
    private onDocumentClick(e): void {
        const { target } = e;

        if (target.closest('.react-slct-menu')) {
            return;
        }

        if (this.container && !this.container.contains(target)) {
            this.closeMenu();
        }
    }

    @bind
    private onKeyDown({ keyCode }: React.KeyboardEvent): void {
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

    @bind
    private onKeyUp({ keyCode }: React.KeyboardEvent): void {
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
                } else if (
                    selectedIndex !== undefined &&
                    this.options[selectedIndex]
                ) {
                    const option = this.options[selectedIndex];
                    const newValue = option.value;

                    this.onOptionSelect(
                        isArray(value) ? [...value, newValue] : newValue,
                        option
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

    private handleBlindText(keyCode: number): void {
        const { blindText } = this.state;

        if (keyCode === keys.BACKSPACE && blindText.length) {
            clearTimeout(this.blindTextTimeout);

            this.setState(
                {
                    blindText: blindText.slice(0, blindText.length - 1)
                },
                this.cleanBlindText
            );
        } else if (keyCode === keys.SPACE) {
            clearTimeout(this.blindTextTimeout);

            this.setState(
                {
                    blindText: blindText + ' '
                },
                this.cleanBlindText
            );
        } else {
            const key = String.fromCodePoint(keyCode);

            if (/\w/.test(key)) {
                clearTimeout(this.blindTextTimeout);

                this.setState(
                    {
                        blindText: blindText + key
                    },
                    this.cleanBlindText
                );
            }
        }
    }

    @bind
    private onContainerRef(el: HTMLDivElement | null): void {
        this.container = el;
    }

    private handleBlindTextUpdate(): void {
        const { open, blindText } = this.state;
        const { multi } = this.props;

        if (open) {
            const selectedIndex = this.options.findIndex(option =>
                option.label.toLowerCase().startsWith(blindText.toLowerCase())
            );

            if (selectedIndex >= 0) {
                this.setState({ selectedIndex });
            }
        } else if (!multi) {
            if (blindText) {
                const option = this.options.find(option =>
                    option.label
                        .toLowerCase()
                        .startsWith(blindText.toLowerCase())
                );

                if (option) {
                    this.onOptionSelect(option.value, option);
                }
            } else {
                this.onOptionSelect(undefined);
            }
        }
    }
}
