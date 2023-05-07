import {mdiPlus, mdiPlusCircle, mdiPlusOutline} from '@mdi/js';
import React, {FC, useContext, useEffect, useState} from 'react';
import {SearchInput} from '../../comps';
import {IconBtn} from '../../comps/icn_btn';
import {TasksContext} from '../../contexts/tasksContext';
import Task from '../../tasks/task';
import {isRef} from '../../utils';

interface IDashBoardHeader {
    isEdit: boolean
    onAdd: (state: boolean) => void
    discard: boolean
}

export const DashBoardHeader: FC<IDashBoardHeader>  = (
    {
        onAdd,
        discard,
        isEdit,
    }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState(null)

    const tasks = useContext(TasksContext)

    
    useEffect(() => {
        onAdd(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (discard === true) {
            setIsOpen(false)
        }
    }, [discard])

    const handleOnSearch = (val: string, _event: any) => {
        if (isRef(tasks)) {
            tasks.current.do_text_search(val).then((e: Array<Task> | any) => {
                if (val.length > 0) {
                    setResults(e.length)
                }
            })  

        }
    }
    const handleOnAbort = () => {
        if (isRef(tasks)) {
            tasks.current.reset_search()        
                setResults(null)
            }

    }


    return (<>
        <div className="dashboard-header" >
            {isOpen ? <div>Create Task</div>: isEdit ? <div>Edit Task</div>:<div>Your Tasks</div>}
                <SearchInput
                    id={"task_search"}
                    onSearch={handleOnSearch}
                    onAbort={handleOnAbort}
                    resLen={results}
                />
                <IconBtn 
                    id={"create-task"} 
                    mdiPath={mdiPlusCircle} 
                    size={"22px"}
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    isActive={isOpen}
                    />
        </div>
    </>)
}
