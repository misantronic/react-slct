export interface SelectProps<T = any> {
    className?: string;
    options?: Option<T>[];
    value?: T | T[];
    placeholder?: string;
    emptyText?: string;
    creatable?: boolean;
    clearable?: boolean;
    searchable?: boolean;
    disabled?: boolean;
    multi?: boolean;
    native?: boolean;
    menuComponent?:
        | React.ComponentClass<MenuComponentProps>
        | React.StatelessComponent<MenuComponentProps>;
    labelComponent?:
        | React.ComponentClass<Option<T>>
        | React.StatelessComponent<Option<T>>;
    optionComponent?:
        | React.ComponentClass<OptionComponentProps>
        | React.StatelessComponent<OptionComponentProps>;
    valueComponentSingle?:
        | React.ComponentClass<ValueComponentSingleProps>
        | React.StatelessComponent<ValueComponentSingleProps>;
    valueComponentMulti?:
        | React.ComponentClass<ValueComponentMultiProps>
        | React.StatelessComponent<ValueComponentMultiProps>;
    children?(config: {
        value?: T | T[];
        options: Option[];
        placeholder?: string;
        open?: boolean;
        MenuContainer: React.ComponentClass<MenuContainerProps>;
        onToggle(): void;
        onRef(el?: HTMLDivElement): void;
    }): React.ReactNode;
    onCreateText?(value: string): string;
    onChange?(value: T | T[], option?: Option<T>): void;
    onCreate?(value: string): void;
    onSearch?(value: string): void;
}

export interface SelectState {
    open: boolean;
    /** current search-value */
    search?: string;
    /** currently selected option-index */
    selectedIndex?: number;
    /** blindText is set when typing in a non-searchable text */
    blindText: string;
    focused?: boolean;
}

export interface Option<T = any> {
    value: T;
    disabled?: boolean;
    label: string;
    [key: string]: any;
}

export interface MenuComponentProps<T = any> {
    options: SelectProps['options'];
    value: SelectProps['value'];
    menuComponent: SelectProps['menuComponent'];
    labelComponent: SelectProps['labelComponent'];
    optionComponent: SelectProps['optionComponent'];
    emptyText: SelectProps['emptyText'];
    multi: SelectProps['multi'];
    selectedIndex?: number;
    open: boolean;
    search?: string;
    onSelect(value: T | T[], option?: T): void;
}

export interface MenuContainerProps {
    className?: string;
    menuWidth?: number;
    menuHeight?: number;
    rect?: Rect;
    onRect?(rect?: Rect): void;
}

export interface OptionComponentProps<T = any> {
    option: Option<T>;
    active?: boolean;
    selected?: boolean;
    labelComponent: SelectProps['labelComponent'];
    onSelect(value: T, option?: Option<T>): void;
}

export interface ValueComponentSingleProps<T = any> {
    option: Option<T>;
    labelComponent: SelectProps['labelComponent'];
}

export interface ValueComponentMultiProps<T = any>
    extends ValueComponentSingleProps<T> {
    onRemove(value: T): void;
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
