export class DtValidator {
    validated_month: string | null
    validated_day: string | null
    validated_year: string | null

    constructor() {
        this.validated_month = null 
        this.validated_day = null 
        this.validated_year = null 
    }

    validateDate(str: string): "" | string | null {
        if (str.length === 0) {
            return null
        }

        if (str.length === 1) {
            if (str === "0") {
               return null
            }
            let val = try_int(str) 
            if (val === null) {
                return null
            } else {
                this.validated_day = val
                return ""
            }
        }







        return "" 
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
