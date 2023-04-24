import React, {FC, useContext, useEffect, useState} from 'react';
import {TextArea, TextInput} from '../comps';
import {TextBtn} from '../comps/text_btn';
import {TasksContext} from '../contexts/tasksContext';
import {isRef} from '../utils';

interface IAddTask {
    onDiscard: () => void
}

export const AddTask: FC<IAddTask> = ({onDiscard}) => {
    
    const tasks = useContext(TasksContext)
    const [reset, setReset] = useState(false)

    useEffect(() => {
        if (isRef(tasks)) {
            tasks.current.new()
        }
    }, [])

    const handleInput = (key: string, value: string, _event: any) => {
        if (isRef(tasks)) {
            let ts = tasks.current
            switch (key) {
                case "name":
                    ts.setName(value)
                    break;
                case "description":
                    ts.setDescription(value)
                default: 
                    break;
            }
        }
    }

    const doCreate = () => {
        if (isRef(tasks)) {
            tasks.current.create_task().then()
        }
    }


    
      return (
        <>
            <div className="add-task-section">
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
                <div className={"btn-group-row right"}>
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
            </div>
        </>
      );
};
