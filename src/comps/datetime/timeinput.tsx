import {FC, useEffect, useState, SetStateAction} from "react"
import {isEmpty, isRef, preventDefaults} from "../../utils"
import {DateTime, doubleDigitString, validateHours, validateMinutes} from "./datetime"



export const TimeInput: FC<IDateTimeInput> = ({
    id, value, placeholder, onChange, label}) => {
    const [value_H, setValue_H] = useState("")
    const [value_M, setValue_M] = useState("")
    const [error_H, setError_H] = useState(false)
    const [error_M, setError_M] = useState(false)
    const [inFocusH, setInFocusH] = useState(false)
    const [inFocusM, setInFocusM] = useState(false)
    const [phHours, setPhHours] = useState("")
    const [phMinutes, setPhMinutes] = useState("")
    const [currentDT, setCurrentDT] = useState<any | DateTime | null | SetStateAction<DateTime | null>>(null)

    //false === am // true === pm
    const [period, setPeriod] = useState(false)

    useEffect(() => {
        if (value && value !== "") {
            let split = value.split(":")
            console.log(split)
            setValue_H(split[0])
            setValue_M(split[1])
        }


    }, [value])
    
    useEffect(() => {

        if (!isEmpty(placeholder)) {
            let str = placeholder.str.slice(0, placeholder.str.indexOf(" "))
            let split = str.split(":")
            setPhHours(split[0])
            setPhMinutes(split[1])
        }
    }, [placeholder])


    const handleChange = (event: any) => {
        let v = event.target.value;
        let n = event.target.name;
        if (n === "hours") {
            setValue_H(v)
        } else {
            setValue_M(v)
        }
    }

    const handleBlur = (event: any) => {
        let n = event.target.name;
        let dt = currentDT
        if (n === "hours") {
            setInFocusH(false)
            if (dt === null) {
                dt = new DateTime()
            }
            if (validateHours(value_H)) {
                (dt as DateTime).setHours(value_H)
                setValue_H(doubleDigitString(parseInt(value_H)))
                setError_H(false)
            } else {
                setError_H(true)
            }
        } else {
            setInFocusM(false)
            if (value_M === "") {
                return
            }
            if (dt === null) {
                dt = new DateTime()
            }
            if (validateMinutes(value_M)) {
                (dt as DateTime).setMinutes(value_M)
                setValue_M(doubleDigitString(parseInt(value_M)))
                setError_M(false)
            } else {
                setError_M(true)
            }
        }

        if (value_H === "") {
            if (dt !== null) {
                dt.setHours(null)
                dt.setMinutes(null)
            }
            if (value_M.length > 0) {
                setError_H(true)
            } else {
                setError_H(false)
            }
            setCurrentDT(dt)
            onChange(dt.toTimeString(period ? "pm" : "am"), error_H)
            setValue_M("")
            return
        }
        setCurrentDT(dt)
        onChange(dt.toTimeString(period ? "pm" : "am"), error_H || error_M)
    }

    useEffect(() => {
        if (value_H !== "") {
            let dt = currentDT;
            if (dt === null) {
                dt = new DateTime()
            }
            dt.setPeriod(period ? "pm" : "am")
            setCurrentDT(dt)
            onChange(dt.toTimeString(period ? "pm" : "am"), error_H || error_M)
        }
    }, [period])

    return (<>
        <div 
            className={"dt-input-wrapper"}>
            <div className={`dt-input-label ${error_H || error_M ? "errs" : inFocusM || inFocusH ? "focused" : ""}`}>{label}</div>
            <div className={`dt-input-box`} id={"bait_" + id}>
                <input
                    name="hours"
                    className={`dt-time-input-text-input ${error_H ? "errs" : inFocusH ? "focused" : ""}`}
                    placeholder={phHours}
                    value={value_H}
                    onChange={handleChange}
                    onFocus={() => {
                        setInFocusH(true)
                    }}
                    onBlur={handleBlur}
                    />
                <span className={"dt-time-colon"}>:</span>
                <input
                    onFocus={() => {
                        setInFocusM(true)
                    }}
                    onBlur={handleBlur}
                    name="minutes"
                    className={`dt-time-input-text-input ${error_M ? "errs" : inFocusM ? "focused" : ""}`}
                    placeholder={phMinutes}
                    value={value_M}
                    onChange={handleChange}
                />
                <div 
                    className={"dt-time-period-wrapper"}
                    onMouseDown={preventDefaults}
                    onClick={(event: any) => {
                        setPeriod(!period)
                    }}
                >
                    <div
                        className={`dt-time-period am ${!period ? "shows" : "hidden"}`}
                        >am</div> 
                    <div
                        className={`dt-time-period pm ${period ? "shows" : "hidden"}`}
                    >pm</div> 
                </div>
            </div>
        </div>
    </>)
}
