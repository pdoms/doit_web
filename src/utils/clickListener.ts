export class ClickListener {
    top_id: string
    wrap: (event: any) => void
    element: HTMLElement | null
    constructor (top_id: string) {
        this.top_id = top_id
        this.wrap = (event: any) => {}
        this.element = document.getElementById(top_id)
    }

    listener(event: any, id: string, cb: () => void, element: HTMLElement | null) {
        let el = event.target
        if (el && el.id === id) {
            return
        } else {
            if (element === null) {
                return
            }
            let els = element.getElementsByTagName("*")
            
            for (let i = 0; i < els.length; i++) {
                if (els[i] && els[i].id && els[i].id === id) {
                    return
                }
            }
        }
        cb()
    }


    register(cb: () => void) {
        let id =this.top_id
        let elem = this.element
        this.wrap = (event: any) => {
            this.listener(event, id, cb, elem)
        }
        window.addEventListener("click", this.wrap)
    }

    deregister() {
        window.removeEventListener("click", this.wrap)
    }


}

