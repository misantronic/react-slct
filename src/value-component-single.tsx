import * as React from 'react';
import { SelectLabel } from './label';
import { ValueComponentSingleProps } from './typings';

export const ValueComponentSingle = React.memo(
    (props: ValueComponentSingleProps) => {
        const Label = props.labelComponent || (SelectLabel as any);

        return (
            <Label
                active
                type="value-single"
                className="value-single"
                {...props.option}
            >
                {props.option.label}
            </Label>
        );
    }
);
