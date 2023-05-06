import {doc} from 'prettier';
import React, {FC, useContext, useEffect, useState} from 'react';
import {DateTimePicker, TextArea, TextInput} from '../comps';
import {DateTime} from '../comps/datetime/datetime';
import {TextBtn} from '../comps/text_btn';
import {TasksContext} from '../contexts/tasksContext';
import {isRef} from '../utils';

interface IAddTask {
    onDiscard: () => void
    doDiscard: boolean
    doClose: () => void
    
    
}


export const AddTask: FC<IAddTask> = ({onDiscard, doDiscard, doClose}) => {
    
    const tasks = useContext(TasksContext)
    const [reset, setReset] = useState(false)

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
                    break;
                default: 
                    break;
            }
        }
    }

    const doCreate = () => {
        if (isRef(tasks)) {
            tasks.current.create_task().then(() => {
                    doClose()
                    setReset(true)
                    setTimeout(() => {
                        setReset(false)
                    }, 500)
                }
            )
        }
    }


    
      return (
        <>
            <div className="add-task-section">
            <div className="add-task-section-left">
                <TextInput
                    id="add-task-name"
                    value={""}
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
                        value={""}
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
                        value={null}
                        call={false}
                        getDT={(dt: DateTime) => {
                            handleInput("due", dt, null)
                        }}
                        doDiscard={reset}
                    />
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
                        text={"create"}
                        onClick={doCreate}
                    />
                </div>
        </>
      );
};
