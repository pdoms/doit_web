import React, {FC, useRef} from 'react'
import {DateTime} from './datetime'
import { DateTimeContextProvider } from './dtcontext'
import {Inputs} from './inputs'

interface IDateTimePicker {
    call: boolean,
    getDT: (dt: DateTime) => void
    value: Date | null | undefined 
    doDiscard: boolean
}

export const DateTimePicker: FC<IDateTimePicker> = ({call, getDT, value, doDiscard}) => {
    
    return (<>
        <div>
            <DateTimeContextProvider>
                <Inputs 
                    doDiscard={doDiscard}
                    call={call} 
                    getDT={getDT}
                    value={value}
                />
            </DateTimeContextProvider>
        </div>
    </>)
}
