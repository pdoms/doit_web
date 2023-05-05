import {MutableRefObject} from "react"
export * from "./clickListener"

export function preventDefaults(event: any): void {
    event.preventDefault()
    event.stopPropagation()
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
    
}

export async function waitForRef(ref: MutableRefObject<any>): Promise<void> {
    while (!ref.current) {
        await delay(100)
    }
}
export function isRef(ref: MutableRefObject<any>): boolean {
    return ref !== undefined && ref.current !== undefined
}

export function getRestUrl(): string {
    let url = ""
    if ("VITE_REST_PROT" in import.meta.env) {
        url += `${import.meta.env.VITE_REST_PROT}://`
    }
    if ("VITE_REST_HOST" in import.meta.env) {
        url += import.meta.env.VITE_REST_HOST || ""
    } else {
        throw Error("No Rest Api Host set")
    }
    if ("VITE_REST_PORT" in import.meta.env) {
        url += `:${import.meta.env.VITE_REST_PORT}`
    }
    return url
}

export function readDateFromRawTask(date: string | Date): Date | null {
    if (date instanceof Date) {
        return date 
    }
    if (typeof date === "string") {
        return new Date(date)
    }
    return null
}

export function isEmpty(trg: any) {
    if (trg === null || trg === undefined) {
        return true
    }
    if(Array.isArray(trg) || typeof trg === "string") {
        return trg.length === 0
    }

    if (typeof trg === "object") {
        return Object.keys(trg).length === 0
    }
    return false 

}

export function validateRegexStr(rx: string, value: string): boolean {
    let regex = new RegExp(rx)
    return regex.test(value)
}


