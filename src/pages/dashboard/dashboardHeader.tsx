import {mdiPlus, mdiPlusCircle, mdiPlusOutline} from '@mdi/js';
import React, {FC, useEffect, useState} from 'react';
import {IconBtn} from '../../comps/icn_btn';

interface IDashBoardHeader {
    onAdd: (state: boolean) => void
    discard: boolean
}

export const DashBoardHeader: FC<IDashBoardHeader>  = (
    {
        onAdd,
        discard
    }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    useEffect(() => {
        onAdd(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (discard === true) {
            setIsOpen(false)
        }
    }, [discard])


    return (<>
        <div className='dashboard-header'>
            {isOpen ? <div>Create Task</div>:<div>Your Tasks</div>}
            <div>
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
        </div>
    </>)
}
