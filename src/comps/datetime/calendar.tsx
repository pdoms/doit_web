import {mdiArrowLeft, mdiArrowRight} from "@mdi/js";
import Icon from "@mdi/react";
import React, {FC, SetStateAction, useEffect, useRef, useState} from "react";
import {ClickListener, isRef, preventDefaults} from "../../utils";
import {Cal, getMonthStr, WEEKDAYS} from "./cal";
import {DateTime} from "./datetime";


interface ICalendar {
    getSelection: (dt: DateTime) => void
    setSelection: DateTime | null
}

export const Calendar: FC<ICalendar> = ({getSelection, setSelection}) => {
    

    let cal = useRef(new Cal())

    const [days, setDays] = useState<Array<CalendarDay> | SetStateAction<Array<CalendarDay>>>([])
    const [daysStart, setDaysStart] = useState(0)
    const [daysEnd, setDaysEnd] = useState(0)
    const [month, setMonth] = useState(-1)
    const [year, setYear] = useState(-1)
    const [today, setToday] = useState<IDX | null>(null)
    const [selectedIdx, setSelectedIdx] = useState<IDX | null>(null)
    const [selectedDay, setSelectedDay] = useState<IDX | null>(null)
 
    const setStates = (type: "now" | "prev" | "next") => {
        if (isRef(cal)) {
            if (type === "now") {
                cal.current.initNow()
            } else if (type === "prev") {
                cal.current.prevMonth()
            } else if (type === "next") {
                cal.current.nextMonth()
            }

            let ds = cal.current.getDays()
            if (ds !== null) {
                setDays(ds.days)
                setDaysStart(ds.month_start_idx)
                setDaysEnd(ds.month_start_idx + ds.month_length )
                setMonth(cal.current.getMonth())
                setYear(cal.current.getYear())
                setToday(cal.current.getTodayIdx())
                if (setSelection !== null) {
                    setSelectedDay(setSelection.day)
                } else {
                    setSelectedDay(null)
                }
            }
        }
    }


    useEffect(() => {
        setStates("now")
    }, []) 

    useEffect(() => {
        if (isRef(cal)) {
            if (setSelection !== null) {
                cal.current.initDateTime(setSelection)
                let ds = cal.current.getDays()
                if (ds !== null) {
                    setDays(ds.days)
                    setDaysStart(ds.month_start_idx)
                    setDaysEnd(ds.month_start_idx + ds.month_length )
                    setMonth(cal.current.getMonth())
                    setYear(cal.current.getYear())
                    setToday(cal.current.getTodayIdx())
                }
                setSelectedDay(setSelection.day)
            } else {
                setStates("now")
            }}
    }, [setSelection])

    useEffect(() => {
        if (isRef(cal) && selectedDay !== null) {
            setSelectedIdx(cal.current.getIdxForMDY(month, selectedDay, year))
        } else {
            setSelectedIdx(null)
        }
    }, [selectedDay])


    const doSelection = (day: CalendarDay) => {
        let dt = new DateTime()
        dt.setMDY(month, day.day, year)
        getSelection(dt)
    }


    return (<>
            <div>
                <div className={"cal-header"}>
                    <div className={"cal-arrow-btn"}
                         onMouseDown={preventDefaults}
                         onClick={(event: any) => {
                            preventDefaults(event)
                            setStates("prev")
                         }}
                    >
                        <Icon 
                            path={mdiArrowLeft}
                            size={"22px"}
                        />
                    </div>
                            <div className={"cal-month-year"}>
                                <span className={"cal-month-year-unit"}>{year}</span>
                                <span className={"cal-month-year-unit"}>{getMonthStr(month)}</span>
</div>
                        <div className={"cal-arrow-btn"}
                         onMouseDown={preventDefaults}
                         onClick={(event: any) => {
                            preventDefaults(event)
                            setStates("next")
                         }}
                    >
                        <Icon 
                            path={mdiArrowRight}
                            size={"22px"}
                        />
                    </div>

                </div>
                <div 
                    className={"cal-days"}
                    >
                    {WEEKDAYS.map((wd: string) => (
                        <div key={wd} className={"cal-tile weekday"}>{wd.slice(0,2)}</div>
                    ) )}
                    {(days as Array<CalendarDay>).map((day: CalendarDay, idx: number) => (
                        <div 
                            key={idx}
                            className={`cal-tile ${
                                isSelectable(idx, daysStart, daysEnd) ?
                                    selectedIdx && selectedIdx === idx ? "selected": 
                                  today && today === idx ? "today" 
                                  : "day" : "off"
                            }`}
                            onMouseDown={preventDefaults}
                            onClick={(event: any) => {
                                preventDefaults(event)
                                if (isSelectable(idx, daysStart, daysEnd)) {
                                    doSelection(day)
                                }
                            }}
                        >{day.day}</div>
                    ))}
                </div>
                <div className={"cal-footer"}>
                <span 
                         onMouseDown={preventDefaults}
                         onClick={(event: any) => {
                            preventDefaults(event)
                            setStates("now")
                         }}
                className={"cal-footer-btn"}>today</span></div>
            </div>
    </>)
}

function isSelectable(idx: number, start: number, end: number) {
    return idx > start && idx <= end 
}
