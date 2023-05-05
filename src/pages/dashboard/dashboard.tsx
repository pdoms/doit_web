import React, { useState, SetStateAction } from 'react';
import Task from '../../tasks/task';
import {AddTask} from '../add_task';
import {EditTask} from '../edit_task';
import {Listing} from '../listing';
import {DashBoardHeader} from './dashboardHeader';

export const Dashboard = () => {
    const [addActive, setAddActive] = useState(false)
    const [abortAdd, setAbortAdd] = useState(false)
    const [editTask, setEditTask] = useState<string | null | SetStateAction<string | null>>(null)

    const handleForEdit = (task: string) => {
        setAbortAdd(true)
        setEditTask(task)

    }

    return (<>
        <div id={'dashboard'} className={'dashboard'} >
            <DashBoardHeader onAdd={setAddActive} discard={addActive === false} 
                isEdit={editTask !== null}
            />
            <div className={'dashboard-body'}>
                {addActive && 
                    <div>
                        <AddTask 
                            onDiscard={() => {
                                setAddActive(false)
                            }}
                            doDiscard={abortAdd}
                        />
                    </div>}
                {editTask !== null && 
                    <div>
                        <EditTask task_id={editTask as string} doClose={() => setEditTask(null)} doDiscard={false} onDiscard={()=> {
                            setEditTask(null)
                        }}/>

                    </div>
                }
                <Listing 
                    openForEdit={handleForEdit}
                />
            </div>
        </div>
    </>)
}
