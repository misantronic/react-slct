import * as React from 'react';
import { OptionComponentProps } from './typings';
interface OptionItemProps {
    active?: OptionComponentProps['active'];
    selected?: OptionComponentProps['selected'];
    height?: OptionComponentProps['height'];
}
export declare class OptionComponent extends React.PureComponent<OptionComponentProps> {
    static OptionItem: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").Substitute<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, OptionItemProps>>;
    render(): React.ReactNode;
    private onClick;
}
export {};
