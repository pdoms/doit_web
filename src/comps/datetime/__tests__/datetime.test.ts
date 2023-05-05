import {DateTime, doubleDigitString, translateHoursPeriod, try_int, validateHours, validateMinutes} from "../datetime"
describe(
    "datetime module",
    () => {
        test(
            "get now",
            () => {
                let dt = new DateTime()
                dt.now()
                let now = new Date(Date.now())
                expect(dt.month).toBe(now.getMonth()+1)
                expect(dt.day).toBe(now.getDate())
                expect(dt.year).toBe(now.getFullYear())
                expect(dt.hours).toBe(now.getHours())
                expect(dt.minutes).toBe(now.getMinutes())
                expect(dt.seconds).toBe(now.getSeconds())
            }) 
        test(
            "parse date string",
            () => {
                let dt = new DateTime()

                dt.setDateFromStr("")
                expect(dt.month).toBeNull()
                expect(dt.day).toBeNull()
                expect(dt.year).toBeNull()
                
                dt.setDateFromStr("04")
                expect(dt.month).toBe(4)
                expect(dt.day).toBeNull()
                expect(dt.year).toBeNull()
               
                dt.setDateFromStr("04")
                expect(dt.month).toBe(4)
                expect(dt.day).toBeNull()
                expect(dt.year).toBeNull()

                dt.setDateFromStr("04/")
                expect(dt.month).toBe(4)
                expect(dt.day).toBeNull()
                expect(dt.year).toBeNull()

                dt.setDateFromStr("04/29/")
                expect(dt.month).toBe(4)
                expect(dt.day).toBe(29)
                expect(dt.year).toBeNull()

                dt.setDateFromStr("04/29/2023")
                expect(dt.month).toBe(4)
                expect(dt.day).toBe(29)
                expect(dt.year).toBe(2023)
            }
        )
        test("all are null", () => {
            let now = new DateTime()
            now.now()
            expect(now.allAreNull()).toBeFalsy()
            let dt = new DateTime()
            dt.setHMS(4, 5, 6)
            expect(dt.allAreNull()).toBeFalsy()
            expect(new DateTime()).toBeTruthy()
        })
        test("to js date", () => {
            let dt = new DateTime()
            dt.setYear(2023)
            dt.setMonth(5)
            dt.setDay(1)
            dt.setHours(11)
            dt.setMinutes(1)
            dt.setSeconds(0)
            expect(dt.toJsDate()).toEqual(new Date(2023, 4, 1, 11, 1, 0))
        })

        test("is gt now", () => {
            let now = new Date(Date.now())
            let dt = new DateTime()
            dt.setMDY(now.getMonth()+1, now.getDate(), now.getFullYear())
            dt.setHMS(now.getHours()-2, now.getMinutes(), now.getSeconds())
            expect(dt.isGtNow()).toBeFalsy()
            dt.setHours(now.getHours()+2)
            expect(dt.isGtNow()).toBeTruthy()
            dt.setHours(now.getHours())
            expect(dt.isGtNow()).toBeFalsy()

        })
}) 


describe(
    "datetime helpers",
    () => {
        test("double digit string", () => {
            expect(doubleDigitString(0)).toBe("00")
            expect(doubleDigitString(9)).toBe("09")
            expect(doubleDigitString(10)).toBe("10")
        })

        test("military", () => {
            expect(translateHoursPeriod(1, "pm")).toBe(13)
            expect(translateHoursPeriod(0, "am")).toBe(0)
            expect(translateHoursPeriod(12, "am")).toBe(0)
            expect(translateHoursPeriod(12, "pm")).toBe(12)
        })

        test("try_int", () => {
            expect(try_int("asdf")).toBeNull()
            expect(try_int("1234")).toBe("1234")
        })

        test("validators", () => {
            expect(validateHours("asdf")).toBeFalsy()
            expect(validateHours("13")).toBeFalsy()
            expect(validateHours("-1")).toBeFalsy()
            expect(validateHours("12")).toBeTruthy()
            expect(validateHours("0")).toBeTruthy()

            expect(validateMinutes("asdasdf")).toBeFalsy()
            expect(validateMinutes("60")).toBeFalsy()
            expect(validateMinutes("-1")).toBeFalsy()
            expect(validateMinutes("59")).toBeTruthy()
            expect(validateMinutes("0")).toBeTruthy()
        })
    })
