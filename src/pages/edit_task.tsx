import React, {FC, useContext, useEffect, useState} from 'react';
import {TextArea, TextInput} from '../comps';
import {TasksContext} from '../contexts/tasksContext';
import Task from '../tasks/task';
import {isEmpty, isRef} from '../utils';

interface IEditTask {
    task_id: String 
}

export const EditTask: FC<IEditTask> = ({task_id}) => {
    const tasks = useContext(TasksContext);
    const [task, setTask] = useState({} as Task)

    useEffect(() => {
        if (isRef(tasks) && task_id) {
            setTask(tasks.current.get_by_id(task_id, true));
        }
    }, [task_id])

    return (<>
        {!isEmpty(task) &&
            <div>
                <div>
                    <TextInput
                        id='edit_task_name'
                        label='name'
                        value={task.name}
                    />
                    <TextArea
                        id='edit_task_description'
                        label='description'
                        value={task.description || ""}
                    />
                </div>
                <div>Status</div>
            </div>}
    </>)
}
