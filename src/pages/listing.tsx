import {mdiArrowULeftTopBold, mdiCheck, mdiClose, mdiPencil} from '@mdi/js';
import Icon from '@mdi/react';
import React, { FC, SetStateAction, useContext, useEffect, useState } from 'react';
import {TasksContext} from '../contexts/tasksContext';
import Task from '../tasks/task';
import {getRestUrl, isRef, preventDefaults, waitForRef} from '../utils';

interface IListing {
    openForEdit: (task_id: string) => void
}


export const Listing: FC<IListing> = ({openForEdit}) => {

    const tasks = useContext(TasksContext)
    const [loadedTasks, setLoadedTasks] = useState<Array<Task> | SetStateAction<Task>>([])

    const tasksUpdate = (tsks: Array<Task>) => {
        setLoadedTasks(tsks)
    }
    
    useEffect(() => {
        if (!isRef(tasks)) {
            waitForRef(tasks).then(() => {
                tasks.current.setUrl(getRestUrl())
                tasks.current.registerUpdateFn("listing", tasksUpdate)
                tasks.current.get_all().then()
            })
        } else {
            tasks.current.setUrl(getRestUrl())
            tasks.current.registerUpdateFn("listing", tasksUpdate)
            tasks.current.get_all().then()
        }
    }, [])




  return (
    <>
        <table className="table-wrap">
            <thead>
                <tr className="table-header">
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Last Update</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>      
            <tbody>
                {
                    loadedTasks && 
                        (loadedTasks as Array<Task>).map((tsk: Task, idx: number) => (
                            <tr key={tsk.id || idx} style={tsk.status === "Done" || tsk.status === "Deleted" ? {opacity: "0.5"}:{}}>
                                <td>{tsk.name}</td>
                                <td>{tsk.description || "-"}</td>
                                <td>{tsk.getCreatedAt()}</td>
                                <td>{tsk.getUpdatedAt()}</td>
                                <td>{tsk.getDue()}</td>
                                <td>{tsk.status}</td>
                                <td className={"table-action-column-td"}>
                                    <div className={"table-action-btn"}
                                        title={"edit task"}
                                        onMouseDown={preventDefaults}
                                        onClick={(event: any) => {
                                            preventDefaults(event)
                                            openForEdit(tsk.id)

                                        }}
                                    >
                                        <Icon path={mdiPencil} size={"16px"}/>
                                    </div>
                                    <div className={"table-action-btn delete"}
                                        title={"delete task"}
                                        onMouseDown={preventDefaults}
                                        onClick={(event: any) => {
                                            preventDefaults(event)
                                            if (isRef(tasks)) {
                                                tasks.current.setDeleted(tsk).then()
                                            }
                                        }}
                                        >
                                        <Icon path={mdiClose} size={"16px"}/>
                                    </div>
                                    {
                                        tsk.status !== "Done" && tsk.status !== "Deleted" &&
                                    <div className={"table-action-btn complete"}
                                        title={"complete task"}
                                        onMouseDown={preventDefaults}
                                        onClick={(event: any) => {
                                            preventDefaults(event)
                                            if (isRef(tasks)) {
                                                tasks.current.setDone(tsk).then()
                                            }

                                        }}
                                        >
                                            <Icon path={mdiCheck} size={"16px"}/></div>
                                    }
                                    {
                                         tsk.status === "Deleted" &&
                                    <div className={"table-action-btn reactivate"}
                                        title={"re-activate task"}
                                        onMouseDown={preventDefaults}
                                        onClick={(event: any) => {
                                            preventDefaults(event)
                                            if (isRef(tasks)) {
                                                tasks.current.setReactivated(tsk).then()
                                            }
                                        }}
                                        >
                                            <Icon path={mdiArrowULeftTopBold} size={"16px"}/></div>
                                    }
                                </td>
                            </tr>
                        ))
                }
            </tbody>      
        </table>
    </>
  );
};
