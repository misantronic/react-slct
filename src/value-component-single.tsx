import * as React from 'react';
import { SelectLabel } from './label';
import { ValueComponentSingleProps } from './typings';

export const ValueComponentSingle = (props: ValueComponentSingleProps) => {
    const Label = props.labelComponent || SelectLabel;

    return (
        <Label className="value-single" {...props.option}>
            {props.option.label}
        </Label>
    );
};
