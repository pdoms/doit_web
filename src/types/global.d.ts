import Task from "../tasks/task";

export {};

declare global {


    interface Window {
        _env_: {[key: string]: any}
    }

    type IDX = number

    type RawTask = {
        id: string;
        name: string;
        status: string;
        description?: string | undefined;
        created_at: Date;
        updated_at: Date;
        due?: Date
    };

    type TasksUpdateFn = (tasks: Array<Task>) => void

    type DtFormatObject = {str: string, regex: string}

    type CalendarDay = {day: number, weekday: number, get_weekday: () => string}
    type CalendarDays = {
        days: Array<CalendarDay>
        month_start_idx: number
        month_length: number
    }
    
    interface IDateTimeInput {
        id: string
        placeholder: DtFormatObject 
        onChange: (val: string, err: boolean) => void
        value?: string
        getValue: boolean
        label: string
    }
}
