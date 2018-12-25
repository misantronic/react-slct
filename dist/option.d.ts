import * as React from 'react';
import { OptionComponentProps } from './typings';
interface OptionItemProps {
    active?: OptionComponentProps['active'];
    selected?: OptionComponentProps['selected'];
    height?: OptionComponentProps['height'];
}
export declare class OptionComponent extends React.PureComponent<OptionComponentProps> {
    static OptionItem: import("styled-components").StyledComponent<"div", any, OptionItemProps, never>;
    render(): React.ReactNode;
    private onClick;
}
export {};
