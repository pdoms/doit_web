import React, { FC, SetStateAction, useContext, useEffect, useState } from 'react';
import {TasksContext} from '../contexts/tasksContext';
import Task from '../tasks/task';
import {getRestUrl, isRef, waitForRef} from '../utils';

export const Listing: FC<{}> = () => {

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
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>      
            <tbody>
                {
                    loadedTasks && 
                        (loadedTasks as Array<Task>).map((tsk: Task, idx: number) => (
                            <tr key={tsk.id || idx}>
                                <td>{tsk.name}</td>
                                <td>{tsk.description || "-"}</td>
                                <td>{tsk.getCreatedAt()}</td>
                                <td>{tsk.getUpdatedAt()}</td>
                                <td>{tsk.status}</td>
                                <td>---</td>
                            </tr>
                        ))
                }
            </tbody>      
        </table>
    </>
  );
};
