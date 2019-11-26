import * as React from 'react';
import { CSSProperties, memo } from 'react';
import { areEqual } from 'react-window';
import { OptionComponent } from './option';
import { MenuComponentProps } from './typings';
import { equal, isArray } from './utils';

interface MenuRowProps {
    index: number;
    style: CSSProperties;
    equalCompareProp?: string | null;
    data: MenuComponentProps;
}

export const MenuRow = memo(({ index, style, data }: MenuRowProps) => {
    const {
        options = [],
        labelComponent,
        selectedIndex,
        optionComponent,
        rowHeight,
        search,
        equalCompareProp,
        multi,
        onSelect
    } = data;
    const option = options[index];
    const currentValue =
        isArray(data.value) && multi ? data.value : [data.value];
    const Component = optionComponent || OptionComponent;

    return (
        <div style={style}>
            <Component
                option={option}
                labelComponent={labelComponent}
                height={rowHeight}
                active={currentValue.some(val =>
                    equal(val, option.value, equalCompareProp)
                )}
                selected={selectedIndex === index}
                search={search}
                onSelect={onSelect}
            />
        </div>
    );
}, areEqual);
