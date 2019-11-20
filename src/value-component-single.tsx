import * as React from 'react';
import { SelectLabel } from './label';
import { ValueComponentSingleProps } from './typings';

export const ValueComponentSingle = React.memo(
    (props: ValueComponentSingleProps) => {
        const Label = props.labelComponent || (SelectLabel as any);
        const className = ['value-single', props.className]
            .filter(c => Boolean(c))
            .join(' ');

        return (
            <Label
                active
                type="value-single"
                className={className}
                {...props.option}
            >
                {props.option.label}
            </Label>
        );
    }
);
