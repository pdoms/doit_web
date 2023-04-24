import {MutableRefObject} from "react"

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
