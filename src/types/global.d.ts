import Task from "../tasks/task";

export {};

declare global {
    interface Window {
        _env_: {[key: string]: any}
    }
    type RawTask = {
        id: string;
        name: string;
        description?: string | undefined;
        created_at: Date;
        updated_at: Date;
    };

    type TasksUpdateFn = (tasks: Array<Task>) => void
    
}
