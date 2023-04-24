import {createContext, MutableRefObject, useEffect, useRef} from "react";
import Tasks from "../tasks/tasks";


export const TasksContext = createContext<any | null>(null)

export const TasksContextProvider = (props: any) => {

    const tasks = useRef<any | null>()

    useEffect(() => {
        if ((!tasks || !tasks.current)) {
            tasks.current = new Tasks()
        }
    }, [])

    return (
        <TasksContext.Provider value={tasks}>
            {props.children}
        </TasksContext.Provider>
    )
}
