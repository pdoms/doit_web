import {createContext, MutableRefObject, useEffect, useRef} from "react";
import {DateTime} from "./datetime";

export const DateTimeContext = createContext<any | null>(null)

export const DateTimeContextProvider = (props: any) => {

    const dt = useRef<any | null>()

    useEffect(() => {
        if ((!dt || !dt.current)) {
            dt.current = new DateTime()
        }
    }, [])

    return (
        <DateTimeContext.Provider value={dt}>
            {props.children}
        </DateTimeContext.Provider>
    )
}
