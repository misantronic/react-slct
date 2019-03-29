/// <reference types="react" />
declare type ReactComponent<P = {}> = React.ComponentClass<P> | React.StatelessComponent<P>;
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
    error?: boolean;
    rowHeight?: number;
    arrowComponent?: ReactComponent<{
        open: boolean;
    }>;
    clearComponent?: ReactComponent;
    menuComponent?: ReactComponent<MenuComponentProps>;
    labelComponent?: ReactComponent<LabelComponentProps<T>>;
    optionComponent?: ReactComponent<OptionComponentProps>;
    valueComponentSingle?: ReactComponent<ValueComponentSingleProps>;
    valueComponentMulti?: ReactComponent<ValueComponentMultiProps>;
    'data-role'?: string;
    keepSearchOnBlur?: boolean;
    children?(config: {
        value?: T | T[];
        options: Option[];
        placeholder?: string;
        open?: boolean;
        MenuContainer: ReactComponent<MenuContainerProps>;
        onToggle(): void;
        onRef(el: HTMLDivElement | null): void;
    }): React.ReactNode;
    onCreateText?(value: string): string;
    onChange?(value: T extends any[] ? T[] : T, option?: Option<T>): void;
    onCreate?(value: string): void;
    onSearch?(value: string): void;
    onOpen?(): void;
    onClose?(): void;
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
    rowHeight: SelectProps['rowHeight'];
    error: SelectProps['error'];
    selectedIndex?: number;
    open: boolean;
    search?: string;
    onSelect(value: T extends any[] ? T[] : T, option?: T): void;
}
export interface MenuContainerProps {
    className?: string;
    menuWidth?: number;
    menuHeight?: number;
    error?: boolean;
    rect?: Rect;
    onRect?(rect?: Rect): void;
    onRef?(el: HTMLDivElement | null): void;
    onClick?(el: React.MouseEvent<HTMLDivElement>): void;
}
export interface OptionComponentProps<T = any> {
    option: Option<T>;
    active?: boolean;
    selected?: boolean;
    height?: number;
    labelComponent: SelectProps['labelComponent'];
    search: SelectState['search'];
    onSelect(value: T, option?: Option<T>): void;
}
export interface ValueComponentSingleProps<T = any> {
    option: Option<T>;
    labelComponent: SelectProps['labelComponent'];
}
export interface ValueComponentMultiProps<T = any> extends ValueComponentSingleProps<T> {
    options: Option<T>[];
    onRemove(value: T): void;
}
export declare type LabelComponentProps<T = any> = Option<T> & {
    active: boolean;
    type: 'value-single' | 'value-multi' | 'option';
};
export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export {};
