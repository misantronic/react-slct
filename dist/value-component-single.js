import * as React from 'react';
import { SelectLabel } from './label';
export const ValueComponentSingle = (props) => {
    const Label = props.labelComponent || SelectLabel;
    return (React.createElement(Label, Object.assign({ className: "value-single" }, props.option), props.option.label));
};
//# sourceMappingURL=value-component-single.js.map