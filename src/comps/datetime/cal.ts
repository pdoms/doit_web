import {DateTime} from "./datetime";

const MONTH_TO_DAYS = {
    non_leap: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    leap: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}

export const MONTH_WORD = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]
export const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]



export class Cal {
    datetime: DateTime
    month: MonthDays | null
    constructor() {
        this.datetime =  new DateTime()
        this.month =  null
    }

    initNow() {
        this.datetime.now()
        if (this.datetime.month !== null && this.datetime.year !== null) {
            this.month = new MonthDays(this.datetime.month, this.datetime.year)
        }

    }

    initDateTime(dt: DateTime) {
        this.datetime = dt
        if (this.datetime.month !== null && this.datetime.year !== null) {
            this.month = new MonthDays(this.datetime.month, this.datetime.year)
        }
    }


    nextMonth() {
        if (this.month) {
            this.month = this.month.getNextMonth()
        }
    }
    prevMonth() {
        if (this.month) {
            this.month = this.month.getPrevMonth()
        }
    }

    getYear(): number {
        return this.month !== null ? this.month.year : -1
    }
    getMonth(): number {
        return this.month !== null ? this.month.month : -1
    }
    getDays(): CalendarDays | null {
        return this.month !== null ? this.month.days : null
    }

    isLeapYear(): boolean | undefined {
        let year = this.datetime.year
        if (year === null) {
            return undefined
        } else {
            checkForLeap(year)
        }
    }

    getTodayIdx(): IDX | null {
        if (this.month !== null && 
                this.month.hasToday && 
                this.month.today !== null && 
                this.month.today.day) {
            return this.month.days.month_start_idx - 1 + this.month.today.day
        } else {
            return null
        }
    }

    getIdxForMDY(month: number, day: number, year: number): IDX | null {
        if (this.month && this.month.days) {
            let m = this.month
            if (m.month === month && m.year === year) {
                return m.days.month_start_idx -1 + day
            } 
        }
        return null
    }

}

export class MonthDays {
    month: number
    year: number
    isLeap: boolean
    maxDays: number
    maxMonths: number
    days: CalendarDays
    hasToday: boolean
    today: DateTime | null
    today_idx: number | null

    constructor (month: number, year: number) {
        this.month = month;
        this.year = year; 
        this.isLeap = checkForLeap(this.year)
        this.maxDays = getMonthMaxDays(this.month, this.isLeap) 
        this.days = {days: [], month_start_idx: 0, month_length: this.maxDays}
        this._calculateDays()
        this.maxMonths = 12
        this.hasToday = false
        this.today = null
        this.today_idx = null
        this._getToday()
    }

    _calculateDays() {
        let weekday = getWeekDayForFirstOfMonth(this.year, this.month)
        if (weekday > 0) {
            let _pre_weekday = weekday-1
            // get length of days month before
            let prev_month = prevMonth(this.month)
            let year = prevYear(prev_month, this.year)
            let prev_max_days = getMonthMaxDays(prev_month, checkForLeap(year))
            while (_pre_weekday >= 0) {
                this.days.days.unshift(CalDayFactory(prev_max_days, _pre_weekday))
                prev_max_days--
                _pre_weekday--
            }
            this.days.month_start_idx = this.days.days.length 
        }
        this.days.days.push(CalDayFactory(1, weekday))
        for (let d = 2; d <= this.maxDays; d++) {
            weekday = nextWeekday(weekday)
            this.days.days.push(CalDayFactory(d, weekday))
        }
        let new_month_day = 1
        if (weekday < 6) {
            weekday++
            while (weekday <= 6) {
                this.days.days.push(CalDayFactory(new_month_day, weekday))
                new_month_day++
                weekday++
            }
        }
    }

    _getToday() {
        this.today = new DateTime()
        this.today.now()
        if (this.today.month && this.today.year) {
            this.hasToday = this.month === this.today.month && this.year === this.today.year
        }
        if (this.today.day) {
            this.today_idx = this.today.day-1 
        }
    }

    getDay(day: number) {
        return this.days.days[this.days.month_start_idx+day-1]
    }

    getNextMonth(): MonthDays {
        let m = nextMonth(this.month)
        let y = nextYear(m, this.year)
        return new MonthDays(m, y)
    }
    getPrevMonth(): MonthDays {
        let m = prevMonth(this.month)
        let y = prevYear(m, this.year)
        return new MonthDays(m, y)
    }

}

export function checkForLeap(year: number): boolean {
        return ((year % 4 === 0) && (year % 100 != 0) || (year % 4000 == 0))
}

export function getMonthMaxDays(month: number, isLeap: boolean): number {
    return MONTH_TO_DAYS[isLeap ? "leap" : "non_leap"][month-1]
}

export function getWeekDayStr(this: CalendarDay): string {
    return WEEKDAYS[this.weekday]
}

export function getWeekDayForFirstOfMonth(year: number, month: number): number {
    let d = new Date(year, month-1, 1)
    return d.getDay()
}

export function nextWeekday(current: number): number {
    return current === 6 ? 0 : current += 1
}

export function CalDayFactory(day: number, weekday: number): CalendarDay {
        return {
                day,
                weekday,
                get_weekday: getWeekDayStr
        }    
}

export function nextMonth(month: number): number {
    return month === 12 ?  1 : month += 1
}

export function nextYear(month: number, year: number): number {
    return month === 1 ? year += 1 : year
}

export function prevMonth(month: number): number {
    return month === 1 ?  12 : month -= 1
}

export function prevYear(month: number, year: number): number {
    return month === 12 ? year -= 1 : year
}
export function getMonthStr(month: number) {
    return MONTH_WORD[month-1]
}
