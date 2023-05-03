import {mdiCalendar} from "@mdi/js"
import Icon from "@mdi/react"
import React, {FC, SetStateAction, useEffect, useState, useRef} from "react"
import {ClickListener, isRef, preventDefaults, validateRegexStr} from "../../utils"
import {Calendar} from "./calendar"
import {DateTime} from "./datetime"


export const DateInput: FC<IDateTimeInput> = ({
    id, placeholder, onChange, value, getValue, label
}) => {
    const el = useRef<any>()
    const ev = useRef<any>()
    const [value_, setValue_] = useState("")
    const [error, setError] = useState(false)
    const [inFocus, setInFocus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [currentDT, setCurrentDT] = useState<DateTime | null | SetStateAction<DateTime | null>>(null)

    const clickCb = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (isOpen) {
            ev.current = new ClickListener("bait_" + id)
            ev.current.register(clickCb)
        }
        if (!isOpen && isRef(ev)) {
            ev.current.deregister()
        }
    }, [isOpen])


    useEffect(() => {
        if (value) {
            setValue_(value)
        }
    }, [value]) 

    const handleChange = (event: any) => {
        let v = event.target.value;
        if (v.length === 0) {
            setValue_("")
            setCurrentDT(null)
        }
        if (v.length > 10) {
            setError(true)
        } else {
            setValue_(v)
            setError(false)
        }
    }

    const handleState = () => {
        setInFocus(false)
        if (placeholder) {
            if (value_.length === 0) {
                setCurrentDT(null)
                setError(false)
                return
            }
            if (validateRegexStr(placeholder.regex, value_)) {
                onChange(value_, false)
                let dt = new DateTime()
                dt.setDateFromStr(value_)
                setCurrentDT(dt)
            } else {
                setError(true)
            }
        }
    }

    useEffect(() => {
        if (getValue) {
            onChange(value_, error)
        }
    }, [getValue])

    const handleCalendarSelection = (dt: DateTime) => {
        setValue_(dt.toDateString())
        setCurrentDT(dt)
        onChange(dt.toDateString(), error)
    }


    return (<>
        <div id={id} 
            className={"dt-input-wrapper"}>
            <div className={`dt-input-label ${error ? "errs" : inFocus ? "focused" : ""}`}>{label}</div>

            <div className={`dt-input-box`} id={"bait_" + id}>
                <input 
                    ref={el}
                    style={{width: "100px"}}
                    className={`dt-input-text-input ${error ? "errs" : inFocus ? "focused" : ""}`}
                    placeholder={placeholder ? placeholder.str : ""}
                    value={value_}
                    onChange={handleChange}
                    onBlur={handleState}
                    onFocus={() => {
                        setInFocus(true)
                    }}
                    title={error ? "incorrect input value" : placeholder ? placeholder.str : "MM/DD/YYYY"}
                    onKeyDown={(event: any) => {
                        if (inFocus && event.key === "Enter") {
                            el.current.blur()
                            setIsOpen(false)
                        }
                        if (isOpen && (event.key === "Enter" || event.key === "Escape")) {
                            setIsOpen(false)
                        }
                    }}
                />
                <div className={`dt-input-calender-btn ${error ? "errs" : inFocus ? "focused" : ""}`} 
                onMouseDown={preventDefaults}
                onClick={(event: any) => {
                    preventDefaults(event)
                    setIsOpen(!isOpen)
                    handleState()
                }}
                >
                    <Icon path={mdiCalendar} size={"18px"}/>
                </div>
                {isOpen && <div className={"dt-calendar-wrapper"}>
                    <Calendar
                        getSelection={handleCalendarSelection}
                        setSelection={currentDT as DateTime | null}
                    />
                </div>}
            </div>
        </div>
    </>)
}
