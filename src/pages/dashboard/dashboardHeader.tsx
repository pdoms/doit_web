import {mdiPlus, mdiPlusCircle, mdiPlusOutline} from '@mdi/js';
import React, {FC, useContext, useEffect, useState} from 'react';
import {SearchInput} from '../../comps';
import {IconBtn} from '../../comps/icn_btn';
import {TasksContext} from '../../contexts/tasksContext';
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
            tasks.current.do_text_search(val)
        }
    }
    const handleOnAbort = () => {
        if (isRef(tasks)) {
            tasks.current.reset_search()   
        }
    }


    return (<>
        <div className="dashboard-header" >
            {isOpen ? <div>Create Task</div>: isEdit ? <div>Edit Task</div>:<div>Your Tasks</div>}
                <SearchInput
                    id={"task_search"}
                    onSearch={handleOnSearch}
                    onAbort={handleOnAbort}
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
