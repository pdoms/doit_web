import React, {FC, useContext, useEffect, useState} from 'react';
import {isRef} from '../../utils';
import {DateTimeContext} from './dtcontext';
import {TimeInput} from './timeinput';
import {DateInput} from './dateinput';
import {DateTime} from './datetime';

interface DTInputs {
    call: boolean
    getDT: (dt: DateTime) => void
}

export const Inputs: FC<DTInputs> = ({call, getDT}) => {

    let dt = useContext(DateTimeContext)
    let [placeholders, setPlaceholders] = useState({date: {} as DtFormatObject, time: {} as DtFormatObject})
 
    useEffect(() => {
        if (isRef(dt)) {
            setPlaceholders({date: dt.current.placeholder_date, time: dt.current.placeholder_time})
        }
    }, [])

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
                /> 
            <TimeInput 
                label={"due time"}
                id={"timeinput"}
                placeholder={placeholders.time}
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
