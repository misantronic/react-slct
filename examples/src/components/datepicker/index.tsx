import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Select } from '../../../../src';
import { Menu as MenuComponent } from './menu';
import { MenuTitle } from './menu-title';

interface DatepickerProps {
    placeholder?: string;
    date?: boolean;
    showTime?: boolean;
}

export interface DatepickerState {
    value?: Date;
    date: Date;
    mode: 'year' | 'months' | 'month';
}

const Container = styled.div`
    width: 100%;
    position: relative;
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const Value = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
`;

const Placeholder = styled.span`
    color: #aaa;
`;

const Menu = styled(Flex)`
    position: absolute;
    width: 100%;
    flex-direction: column;
    border: 1px solid #ccc;
    margin-top: -1px;
    box-sizing: border-box;
    padding: 10px;
    background: white;
    z-index: 1;
    max-height: 270px;
    overflow: auto;
`;

const ArrowButton = styled.button`
    font-size: 13px;
    color: #ccc;

    &:hover {
        color: #333;
    }
`;

function startOfDay(date: Date): Date {
    const newDate = new Date(date);

    newDate.setHours(0, 0, 0, 0);

    return newDate;
}

const dateFormat = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});

const timeFormat = new Intl.DateTimeFormat('de-DE', {
    hour: 'numeric',
    minute: 'numeric'
});

export class Datepicker extends React.Component<
    DatepickerProps,
    DatepickerState
> {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'month',
            date: startOfDay(new Date())
        };
    }

    public render(): React.ReactNode {
        const { date = true, showTime, placeholder } = this.props;

        return (
            <Select<Date> value={this.state.value} placeholder={placeholder}>
                {({ value, placeholder, open, onToggle }) => (
                    <Container>
                        <Value onClick={onToggle}>
                            <Flex>
                                <span>📅 </span>
                                {placeholder && (
                                    <Placeholder>{placeholder}</Placeholder>
                                )}
                                {value &&
                                    !Array.isArray(value) && (
                                        <div>
                                            {date && dateFormat.format(value)}{' '}
                                            {showTime &&
                                                timeFormat.format(value)}
                                        </div>
                                    )}
                            </Flex>
                            <ArrowButton>{open ? '▲' : '▼'}</ArrowButton>
                        </Value>
                        {open && (
                            <Menu className="react-slct-menu">
                                <MenuTitle
                                    date={this.state.date}
                                    onMonths={this.onModeMonths}
                                    onYear={this.onModeYear}
                                    onNextMonth={this.onNextMonth}
                                    onPrevMonth={this.onPrevMonth}
                                    onToday={this.onToday}
                                />
                                <MenuComponent
                                    showTime={Boolean(showTime)}
                                    date={this.state.date}
                                    value={value as Date | undefined}
                                    mode={this.state.mode}
                                    onToggle={onToggle}
                                    onSelectDay={this.onSelectDay}
                                    onSelectMonth={this.onSelectMonth}
                                    onSelectYear={this.onSelectYear}
                                    onSelectTime={this.onSelectTime}
                                />
                            </Menu>
                        )}
                    </Container>
                )}
            </Select>
        );
    }

    @bind
    private onSelectDay(date: Date): void {
        const { value } = this.state;

        if (value) {
            date.setHours(value.getHours(), value.getMinutes());
        }

        this.setState({ value: date, date });
    }

    @bind
    private onModeYear() {
        this.setState({ mode: 'year' });
    }

    @bind
    private onModeMonths() {
        this.setState({ mode: 'months' });
    }

    @bind
    private onSelectMonth(date: Date) {
        this.setState({ date, mode: 'month' });
    }

    @bind
    private onSelectYear(date: Date) {
        this.setState({ date, mode: 'months' });
    }

    @bind
    private onToday(): void {
        const now = startOfDay(new Date());

        this.setState({ date: now });
    }

    @bind
    private onNextMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() + 1);

        this.setState({ date });
    }

    @bind
    private onPrevMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() - 1);

        this.setState({ date });
    }

    @bind
    private onSelectTime(time: string): void {
        const value = this.state.value || new Date('1970-01-01');

        if (!time) {
            this.setState({ value: startOfDay(value) });
        } else {
            const splitted = time.split(':');
            const newDate = new Date(value);

            newDate.setHours(
                parseInt(splitted[0], 10),
                parseInt(splitted[1], 10)
            );

            this.setState({ value: newDate });
        }
    }
}
