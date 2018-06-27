import * as React from 'react';
import { Option, SelectProps } from './typings';
interface OptionComponentProps<T = any> extends Option<T> {
    active?: boolean;
    selected?: boolean;
    labelComponent: SelectProps['labelComponent'];
    onSelect(value: T): void;
}
interface OptionItemProps {
    active?: OptionComponentProps['active'];
    selected?: OptionComponentProps['selected'];
}
export declare class OptionComponent extends React.PureComponent<OptionComponentProps> {
    static OptionItem: import("../../../../../Users/dschkalee/src/react-slct/node_modules/styled-components").StyledComponentClass<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & OptionItemProps, any, React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & OptionItemProps>;
    render(): React.ReactNode;
    private onClick;
}
export {};
