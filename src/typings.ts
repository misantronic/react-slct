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
    labelComponent?: React.ComponentClass<any> | React.StatelessComponent<any>;
    onChange?(value: T | T[]): void;
    onCreate?(value: string): void;
}

export interface SelectState {
    open: boolean;
    search?: string;
    selectedIndex?: number;
    rect: Rect;
}

export interface Option<T = any> {
    value: T;
    disabled?: boolean;
    label: string;
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
