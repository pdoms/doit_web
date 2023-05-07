import {mdiFilter, mdiPlus, mdiPlusCircle, mdiPlusOutline, mdiRefresh, mdiRefreshAuto} from '@mdi/js';
import React, {FC, useContext, useEffect, useState} from 'react';
import {SearchInput} from '../../comps';
import {IconBtn} from '../../comps/icn_btn';
import {TasksContext} from '../../contexts/tasksContext';
import Task from '../../tasks/task';
import {isRef, preventDefaults} from '../../utils';
import Icon from '@mdi/react';


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
    const [isRefreshing, setIsRefreshing] = useState("")

    const tasks = useContext(TasksContext)
    
    const refreshCb = () => {
        console.info("User Refresh at", new Date(Date.now()).toISOString())
        show_refresh("user")
    }
    const autoRefreshCb = () => {
        console.info("Auto Refresh at", new Date(Date.now()).toISOString())
        show_refresh("auto")
    }

    const show_refresh = (type: "auto" | "user") => {
        setIsRefreshing(type)
        setTimeout(() => {
            setIsRefreshing("")
        }, 2000)
    }


    useEffect(() => {
        if (isRef(tasks)) {
            tasks.current.registerUpdateFn("refresh", refreshCb)
            tasks.current.registerUpdateFn("autorefresh", autoRefreshCb)
            tasks.current.start_autorefresh()
        }
    }, [])

    const doRefresh = () => {
        if (isRef(tasks)) {
            tasks.current.do_refresh()
        }
    }
    
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
            <div className="dashboard-header-left">
            {isOpen ? <div>Create Task</div>: isEdit ? <div>Edit Task</div>:<div>Your Tasks</div>}
</div>
               <div className="dashboard-header-center">
                <SearchInput
                    id={"task_search"}
                    onSearch={handleOnSearch}
                    onAbort={handleOnAbort}
                    resLen={results}
                />
               </div>
               <div className="dashboard-header-right">
               <div className={`dashboard-header-refresher ${isRefreshing !== "" ? "active" : ""}`}
                    onMouseDown={preventDefaults}
                    onClick={(event: any) => {
                        preventDefaults(event)
                        doRefresh()
                    }}

               > 
                    {isRefreshing === "" || isRefreshing === "user" ?
                        <Icon path={mdiRefresh} size={"22px"}/>  :   
                    <Icon path={mdiRefreshAuto} size={"22px"}/>    
                    }
               </div> 
                <IconBtn 
                    id={"create-task"} 
                    mdiPath={mdiPlusCircle} 
                    size={"22px"}
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    isActive={isOpen}
                    /></div>
        </div>
    </>)
}
