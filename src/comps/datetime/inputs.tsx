import React, {FC, useContext, useEffect, useState} from 'react';
import {isRef} from '../../utils';
import {DateTimeContext} from './dtcontext';
import {TimeInput} from './timeinput';
import {DateInput} from './dateinput';
import {DateTime} from './datetime';

interface DTInputs {
    call: boolean
    getDT: (dt: DateTime) => void
    value: Date | null | undefined
    doDiscard: boolean
}

export const Inputs: FC<DTInputs> = ({call, getDT, value, doDiscard}) => {

    const dt = useContext(DateTimeContext)
    const [placeholders, setPlaceholders] = useState({date: {} as DtFormatObject, time: {} as DtFormatObject})
    const [dateStr, setDateStr] = useState(null)
    const [timeStr, setTimeStr] = useState(null)
 
    useEffect(() => {
        if (isRef(dt)) {
            setPlaceholders({date: dt.current.placeholder_date, time: dt.current.placeholder_time})
        }
    }, [])

    useEffect(() => {
        if (value && isRef(dt) && value instanceof Date) {
            dt.current.fromJsDate(value)
            setDateStr(dt.current.toDateString())
            setTimeStr(dt.current.toTimeStringNaive())
        }
    }, [value])

    useEffect(() => {
        if (doDiscard) {
            setDateStr(null)
            setTimeStr(null)
        }
    }, [doDiscard])
    return (<>
        <div>
            <DateInput 
                id={"dateinput"} 
                placeholder={placeholders.date}
                onChange={(value: string) => {
                    if (isRef(dt)) {
                        dt.current.setDateFromStr(value)
                        getDT(dt.current)
                    }
                }}
                getValue={false}
                label={"due date"}
                value={dateStr !== null ? dateStr : ""}
                /> 
            <TimeInput 
                label={"due time"}
                id={"timeinput"}
                placeholder={placeholders.time}
                value={timeStr ? timeStr : ""}
                onChange={(value: string) => {
                    if (isRef(dt)) {
                        dt.current.setTimeFromStr(value)
                        getDT(dt.current)
                    }
                }}
                getValue={false}
            /> 
        </div>
    </>)
}
