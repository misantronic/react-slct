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
    required?: boolean;
    rowHeight?: number;
    menuWidth?: number;
    menuHeight?: number;
    hideSelectedOptions?: boolean;
    equalCompareProp?: string | null;
    arrowComponent?: ReactComponent<{
        open: boolean;
    }>;
    clearComponent?: ReactComponent;
    menuComponent?: ReactComponent<MenuComponentProps>;
    labelComponent?: ReactComponent<LabelComponentProps<T>>;
    optionComponent?: ReactComponent<OptionComponentProps>;
    valueComponentSingle?: ReactComponent<ValueComponentSingleProps>;
    valueComponentMulti?: ReactComponent<ValueComponentMultiProps>;
    valueIconComponent?: ReactComponent;
    'data-role'?: string;
    keepSearchOnBlur?: boolean;
    control?: React.MutableRefObject<SelectStaticControl | undefined>;
    children?(config: {
        value?: T | T[];
        options: Option[];
        placeholder?: string;
        open?: boolean;
        MenuContainer: ReactComponent<MenuContainerProps>;
        onToggle(): void;
        onClose(): void;
        onOpen(): void;
        onRef?: ((instance: HTMLDivElement) => void) | React.Ref<HTMLDivElement>;
    }): JSX.Element | null;
    creatableText?: (value: string) => string | string;
    onChange?(value: T extends any[] ? T[] : T, option?: Option<T>): void;
    onCreate?(value: string): void;
    onSearch?(value: string): void;
    onOpen?(): void;
    onClose?(): void;
}
export interface SelectStaticControl {
    open(): void;
    close(): void;
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
    menuWidth: SelectProps['menuHeight'];
    menuHeight: SelectProps['menuHeight'];
    hideSelectedOptions: SelectProps['hideSelectedOptions'];
    equalCompareProp: SelectProps['equalCompareProp'];
    error: SelectProps['error'];
    selectedIndex?: number;
    open: boolean;
    search?: string;
    onSelect(value: T extends any[] ? T[] : T, option?: T): void;
}
export interface MenuContainerProps {
    className?: string;
    menuLeft?: number;
    menuTop?: number;
    menuWidth?: RectSize;
    menuHeight?: RectSize;
    error?: boolean;
    children?: React.ReactNode;
    onRect?(menuOverlay?: Rect, menuWrapper?: Rect): void;
    onStyle?(style: Rect): void;
    onRef?(el: HTMLDivElement | null): void;
    onClick?(el: React.MouseEvent<HTMLDivElement>): void;
}
export interface OptionComponentProps<T = any> {
    className?: string;
    option: Option<T>;
    active?: boolean;
    selected?: boolean;
    height?: number;
    labelComponent: SelectProps['labelComponent'];
    search?: string;
    onSelect(value: T, option?: Option<T>): void;
}
export interface ValueComponentSingleProps<T = any> {
    className?: string;
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
declare type RectSize = number | 'auto';
export interface Rect {
    left: number;
    top: number;
    width: RectSize;
    height: RectSize;
}
export {};
