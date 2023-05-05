import {doc} from 'prettier';
import React, {FC, useContext, useEffect, useState} from 'react';
import {DateTimePicker, TextArea, TextInput} from '../comps';
import {DateTime} from '../comps/datetime/datetime';
import {TextBtn} from '../comps/text_btn';
import {TasksContext} from '../contexts/tasksContext';
import Task from '../tasks/task';
import {isEmpty, isRef} from '../utils';

interface IEditTask {
    task_id: String 
    onDiscard: () => void
    doDiscard: boolean
    doClose: () => void
}

export const EditTask: FC<IEditTask> = ({task_id, onDiscard, doDiscard, doClose}) => {
    const tasks = useContext(TasksContext);
    const [task, setTask] = useState({} as Task)
    const [reset, setReset] = useState(false)
    const [overdue, setOverdue] = useState(false)

    useEffect(() => {
        if (isRef(tasks) && task_id) {
            tasks.current.get_by_id(task_id, true).then((tsk: Task) => {
                setTask(tsk)
                if (tsk.status === "overdue") {
                    setOverdue(true)
                } else {
                    setOverdue(false)
                }
            });
        }
    }, [task_id])
    
    useEffect(() => {
        if (doDiscard) {
            setReset(true)
        }
    }, [doDiscard])

    useEffect(() => {
        if (isRef(tasks)) {
            tasks.current.new()
        }
    }, [])

    const handleInput = (key: string, value: string | DateTime, _event: any) => {
        if (isRef(tasks)) {
            let ts = tasks.current
            switch (key) {
                case "name":
                    ts.setName(value)
                    break;
                case "description":
                    ts.setDescription(value)
                    break;
                case "due":
                    ts.setDue(value)
                    if ((value as DateTime).isGtNow()) {
                        setOverdue(false)
                        ts.setStatus("created")
                        setTask(ts.current_task)
                    }
                    break;
                default: 
                    break;
            }
        }
    }

    const doSave = (event: any) => {
        if (isRef(tasks)) {
            tasks.current.update_task().then((t: Task) => {
                if (!isEmpty(t)) {
                    setTask(t)
                }
            })
            doClose() 
        }
    }

    return (<>
            <div className="add-task-section">
            <div className="add-task-section-left">
                <TextInput
                    id="add-task-name"
                    value={task.name}
                    label={"name"}
                    placeholder={""}
                    maxWidth={"400px"}
                    onChange={(event: any, value: string) => {
                        handleInput("name", value, event)
                    }}
                    reset={reset}
                />
                <TextArea
                        maxWidth={"400px"}
                        id="add-task-description"
                        value={task.description ? task.description : ""}
                        label={"description"}
                        placeholder={""}
                        onChange={(event: any, value: string) => {
                            handleInput("description", value, event)
                        }}
                        reset={reset}
                />
                </div>
            <div className="add-task-section-right">
                    <DateTimePicker 
                        value={task.due}
                        call={false}
                        getDT={(dt: DateTime) => {
                            handleInput("due", dt, null)
                        }}
                        doDiscard={reset}
                    />
                    <div className={"edit-task-status"}><span style={{fontWeight: "bold"}}>Status:</span> <span style={overdue ? {color: "#FF0000"}:{}}>{task.status}</span></div>
            </div>
            </div>
                <div 
                style={{width: "530px", marginBottom: "20px"}}
                className={"btn-group-row right"}>
                    <TextBtn 
                        id={"abort-task"}
                        text={"discard"}
                        onClick={() => {
                            setReset(true)
                            onDiscard()
                            setTimeout(() => {
                                setReset(false)
                            }, 500)
                        }}
                    />
                    <TextBtn 
                        id={"create-task"}
                        text={"save"}
                        onClick={doSave}
                    />
                </div>
    </>)
}

