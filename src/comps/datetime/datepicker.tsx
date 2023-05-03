import React, {FC, useRef} from 'react'
import {DateTime} from './datetime'
import { DateTimeContextProvider } from './dtcontext'
import {Inputs} from './inputs'

interface IDateTimePicker {
    call: boolean,
    getDT: (dt: DateTime) => void
}

export const DateTimePicker: FC<IDateTimePicker> = ({call, getDT}) => {
    
    return (<>
        <div>
            <DateTimeContextProvider>
            <Inputs call={call} getDT={getDT}/>
            </DateTimeContextProvider>
        </div>
    </>)
}
