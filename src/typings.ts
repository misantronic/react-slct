export interface SelectProps<T = any> {
    className?: string;
    options: Option<T>[];
    value?: T | T[];
    placeholder?: string;
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
    onChange?(value: T | T[]): void;
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
    /** position of the options-list */
    rect: Rect;
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
    multi: SelectProps['multi'];
    selectedIndex?: number;
    open: boolean;
    rect: Rect;
    search?: string;
    onSelect(value: T | T[]): void;
}

export interface OptionComponentProps<T = any> extends Option<T> {
    active?: boolean;
    selected?: boolean;
    labelComponent: SelectProps['labelComponent'];
    onSelect(value: T): void;
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
