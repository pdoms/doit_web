import {sep} from "path"

const FMT_DATE = "MM/DD/YYYY"
const REGEX_DATE = "[01][0-9]\/[0-3][0-9]\/[0-9]{4}"
const FMT_TIME = "hh:mm:ss pp"
const REGEX_TIME = "[01][0-9]:[0-5][0-9]:[0-5][0-9]\s[apm]{2}"
const FMT_DT = `${FMT_DATE}, ${FMT_TIME}`




export class DateTime {
    placeholder_date:  DtFormatObject 
    placeholder_time:  DtFormatObject 
    day: number | null
    month: number | null
    year: number | null
    hours: number | null
    minutes: number | null
    seconds: number | null

    constructor() {
        this.placeholder_date = {str: FMT_DATE, regex: REGEX_DATE}
        this.placeholder_time = {str: FMT_TIME, regex: REGEX_TIME}
        this.day = null
        this.month = null
        this.year = null
        this.hours = null
        this.minutes = null
        this.seconds = null

    }

    print() {
        console.log(`
day:      ${this.day}  
month:    ${this.month}  
year:     ${this.year}  
hours:    ${this.hours}  
minutes:  ${this.minutes}  
seconds:  ${this.seconds}`)  
    }
    
    getDisplayDate(fmt=FMT_DATE) {}
    getDisplayTime(fmt=FMT_TIME) {}
    getDisplayDateTime(fmt=FMT_DT) {}
    


    now() {
        let dt = new Date(Date.now())
        this.day     = dt.getDate()
        this.month   = dt.getMonth() + 1
        this.year    = dt.getFullYear()
        this.hours   = dt.getHours()
        this.minutes = dt.getMinutes()
        this.seconds = dt.getSeconds()
    }

    setMDY(month: number, day: number, year: number) {
        this.setDay(day)
        this.setMonth(month)
        this.setYear(year)
    }
    setHMS(hours: number, minutes: number, seconds: number) {
        this.setHours(hours)
        this.setMinutes(minutes)
        this.setSeconds(seconds)
    }

    setPeriod(period: "am"|"pm") {
        if (period === "am") {
            if (this.hours !== null && this.hours >= 12) {
                this.hours -= 12
            }
        } else {
            if (this.hours !== null && this.hours < 12) {
                this.hours += 12
            }
        }
    }




    setDay(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.day = v
            return 
        }
        if (typeof v === "string") {
            this.day = parseInt(v)
            return 
        }
    }

    setMonth(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.month = v
            return 
        }
        if (typeof v === "string") {
            this.month = parseInt(v)
            return 
        }
    }

    setYear(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.year = v
            return 
        }
        if (typeof v === "string") {
            this.year = parseInt(v)
            return 
        }
    }

    setHours(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.hours = v
            return 
        }
        if (typeof v === "string") {
            this.hours = parseInt(v)
            return 
        }
    }

    setMinutes(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.minutes = v
            return 
        }
        if (typeof v === "string") {
            this.minutes = parseInt(v)
            return 
        }
    }

    setSeconds(v: string | number | null) {
        if (v === null || typeof v === "number") {
            this.seconds = v
            return 
        }
        if (typeof v === "string") {
            this.seconds = parseInt(v)
            return 
        }
    }



    setDateFromStr(value: string) {
        let separated = value.split("/").filter(i => i !== "")
        let len = separated.length
        switch (len) {
            case 1:
                this.setMonth(separated[0])
                this.setDay(null)
                this.setYear(null)
                return
            case 2:
                this.setMonth(separated[0]);
                this.setDay(separated[1])
                return
            case 3:
                this.setMonth(separated[0])
                this.setDay(separated[1])
                this.setYear(separated[2])
                return
            default:
                this.setDay(null)
                this.setMonth(null)
                this.setYear(null)
                return
        }
    }

    setTimeFromStr(value: string) {
        let separated = value.split(":").filter(i => i !== "")
        this.setHours(separated[0])
        this.setMinutes(separated[1])
        this.setSeconds(separated[2])
    }

    toDateString() {
        if (this.month && this.day && this.year) {
            return `${doubleDigitString(this.month)}/${doubleDigitString(this.day)}/${this.year}`
        } else {
            return ""
        }
    }

    toTimeString(period: "pm" | "pm") {
        if (this.hours === null) {
            return ""
        } else {
            return `${translateHoursPeriod(this.hours, period)}:${
                this.minutes === null ? "00" : this.minutes}:${
                    this.seconds === null ? "00" : this.seconds}`
        }
    }

    allAreNull() {
        return [this.month, this.day, this.year, this.hours, this.minutes, this.seconds].every((item: number | null) => item === null)
    }

    toJsDate(): Date | null {
        if (this.allAreNull()) {
            return null
        }

        let d = new Date(0,0,0,0,0,0,0)
        let no_date = false
        if (this.month !== null) {
            d.setMonth(this.month-1)
        } else {
            no_date = true
        }
        if (this.day !== null) {
            d.setDate(this.day)
        } else {
            no_date = true
        }
        if (this.year !== null) {
            d.setFullYear(this.year)
        } else {
            no_date = true
        }
        if (this.hours !== null) {
            d.setHours(this.hours)
        }
        if (this.minutes !== null) {
            d.setMinutes(this.minutes)
        }
        if (this.seconds !== null) {
            d.setSeconds(this.seconds)
        }
        if (no_date) {
            return null
        }
        return d
        
    }
}

export function doubleDigitString(val: number): string {
    if (val < 10) {
        return "0" + val.toString()
    } else {
        return val.toString()
    }
}

export function translateHoursPeriod(value: number, period: "am" | "pm" ) {
    if (period === "am") {
        return value === 12 ? 0 : value
    } else {
        return value + 12 === 24 ? 12 : value+12
    }
}
export function try_int(val: string): string | null {
    let parsed = parseInt(val)
    if (Number.isNaN(parsed)) {
        return null
    } else {
        return parsed.toString()
    }
}

export function validateHours(val: string): boolean {
    if (try_int(val) === null) {
        return false
    }
    let as_int = parseInt(val)
    if (as_int > 12 || as_int < 0) {
        return false
    }
    return true
}
export function validateMinutes(val: string): boolean {
    if (try_int(val) === null) {
        return false
    }
    let as_int = parseInt(val)
    if (as_int > 59 || as_int < 0) {
        return false
    }
    return true
}
