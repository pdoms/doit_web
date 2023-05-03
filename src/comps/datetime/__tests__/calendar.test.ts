import {
    Cal,
    CalDayFactory, 
    checkForLeap, 
    getMonthMaxDays, 
    getMonthStr, 
    getWeekDayForFirstOfMonth, 
    MonthDays, 
    nextMonth, 
    nextWeekday, 
    nextYear,
    prevMonth,
    prevYear
} from "../cal"
import {DateTime} from "../datetime"

describe("month builder", () => {
    test("leap year", ()=> {
        let range_start = 2023
        let range_end = 2030
        let expected = [false, true, false, false, false, true, false]
        let results = []
        for (let i = range_start; i < range_end; i++) {
            results.push(checkForLeap(i))
        }
        expect(results).toEqual(expected)
    })
    test("month str rep", () => {
        expect(getMonthStr(1)).toBe("January")
    })
    test("month max days", () => {
        let feb_leap = [2, 29]
        let feb_non_leap = [2, 28]
        let aug = [8, 31]
        let dec = [12, 31]
        let jun = [6, 30]
        expect(getMonthMaxDays(feb_leap[0], true)).toBe(feb_leap[1])
        expect(getMonthMaxDays(feb_non_leap[0], false)).toBe(feb_non_leap[1])
        expect(getMonthMaxDays(aug[0], false)).toBe(aug[1])
        expect(getMonthMaxDays(dec[0], false)).toBe(dec[1])
        expect(getMonthMaxDays(jun[0], false)).toBe(jun[1])
    }) 
    test("CalendarDay", () => {
        let day = CalDayFactory(3, 1) 
        expect(day.get_weekday()).toBe("Mon")
        expect(day.day).toBe(3)
        expect(day.weekday).toBe(1)
    })
    test("weekday first of month", () => {
        expect(getWeekDayForFirstOfMonth(2023, 5)).toBe(1)
    })
    test("next_weekday", () => {
        expect(nextWeekday(0)).toBe(1)
        expect(nextWeekday(3)).toBe(4)
        expect(nextWeekday(6)).toBe(0)
    })

    test("today", () => {
        let today = new Date(Date.now())
        let month = new MonthDays(today.getMonth()+1, today.getFullYear())
        expect(month.hasToday).toBeTruthy()
        expect(month.month).toBe(today.getMonth()+1)
        expect(month.getDay(today.getDate())).toEqual(CalDayFactory(today.getDate(), today.getDay()))
    })

    test("next month and year", () => {
        let sep = 9
        let dec = 12
        let jan = 1
        let oct = 10
        let year1 = 2023
        let year2 = 2024
        expect(nextMonth(sep)).toBe(oct)
        expect(nextYear(oct, year1)).toBe(year1)
        expect(nextMonth(dec)).toBe(jan)
        expect(nextYear(jan, year1)).toBe(year2)
    })
    test("prev month and year", () => {
        let sep = 9
        let dec = 12
        let jan = 1
        let aug = 8
        let year1 = 2023
        let year2 = 2024
        expect(prevMonth(sep)).toBe(aug)
        expect(prevYear(aug, year2)).toBe(year2)
        expect(prevMonth(jan)).toBe(dec)
        expect(prevYear(dec, year2)).toBe(year1)
    })

    test("MonthDays", () => {
        let now = new DateTime() 
        now.now()
        let y =  2023
        let m =  5
        let d =  1
        let md = new MonthDays(m, y)
        md = md.getNextMonth()
        expect(md.month).toBe(6)
        md = md.getPrevMonth()
        md = md.getPrevMonth()
        md = md.getPrevMonth()
        //feb
        md = md.getPrevMonth()
        expect(md.month).toBe(2)
        expect(md.maxDays).toBe(checkForLeap(y) ? 29 : 28)
        md = md.getPrevMonth()
        //change of year
        md = md.getPrevMonth()
        expect(md.month).toBe(12)
        expect(md.year).toBe(2022)

    })
})

describe("calendar", () => {
    test("init now", () => {
        let now = new DateTime() 
        now.now()
        let cal = new Cal()
        cal.initNow()
        expect(cal.getMonth()).toBe(now.month)
        expect(cal.getYear()).toBe(now.year)
        expect(cal.month?.hasToday).toBeTruthy()
        expect(cal.month?.getDay(now.day as number).day).toBe(now.day)

    })
})
