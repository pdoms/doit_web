import {DateTime} from "../comps/datetime/datetime";
import {STR_TO_STATUS} from "../utils";
import Task from "./task";


//TODO indicate zero data at get all and filter results
export default class Tasks {
    url: string | undefined;
    loaded: Array<Task>
    current_task: Task | null 
    _events: {[key: string]: TasksUpdateFn}

    constructor(url?: string) {
        /*
         * The root url for fetching the tasks.
         * */
        this.url = url;
        /**
         * Loaded tasks
         * **/
        this.loaded = []
        /**
         * The currently 'focused' task
        **/
        this.current_task = null

        /**
        * Holds the update functions.
       * **/
        this._events ={}
    }

    print_current() {
        console.log(this.current_task)
    }

    registerUpdateFn(id: string, callback: TasksUpdateFn) {
        if (!(id in this._events)) {
            this._events[id] = callback
        }
    }

    updateAll() {
        for (let key in this._events) {
            this.updateById(key)
        }
    }
    updateById(key: string) {
        if (key in this._events) {
            this._events[key](this.loaded)
        }
    }

    setUrl(url: string) {
        this.url = url;
    }


    async get_all(): Promise<Array<Task>> {
        if (!this.url) {
            return []
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        const response: Response = await fetch(this.url);
        const raw: Array<RawTask> = await response.json();
        this.loaded = []
        if (Array.isArray(raw)) {
            for (let i = 0; i < raw.length; i++) {
                const task = Task.fromRaw(raw[i]);
                this.loaded.push(task);
            }
        }
        
        this.updateAll()
        return this.loaded;
    }

    new() {
        this.current_task = Task.empty()
    }

    setName(name: string) {
        if (this.current_task && this.current_task !== null) {
            this.current_task.setName(name)
        }
        this.print_current()
    }
    setDescription(description: string) {
        if (this.current_task && this.current_task !== null) {
            this.current_task.setDescription(description)
        }
        this.print_current()
    }

    setDue(due: DateTime) {
        if (this.current_task && this.current_task !== null) {
            this.current_task.setDue(due)
        }
        this.print_current()
    }

    
    setStatus(status: TaskStatus) {
        if (this.current_task && this.current_task !== null) {
            this.current_task.setStatus(status)
        }
        this.print_current()
    }



    resetCurrent() {
        this.current_task = null 
    }

    async create_task(): Promise<Array<Task> | any>  {
        if (!this.url) {
            return []
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        let url = this.url + "create"
        let request: Request = new Request(url, {
            method: "POST",
            body: this._current_to_create_body(),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let response:Response = await fetch(request);
        if (response.status >= 200) {
            this.resetCurrent()
            return await this.get_all()
        } else {
            console.error("Error creating task");
            return response.status
        }
    }

    async update_task(): Promise<Task | any> {
        if (!this.url) {
            return {}
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        let request: Request = new Request(this.url, {
            method: "PUT",
            body: this._current_to_update_body(),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let response:Response = await fetch(request);
        if (response.status >= 200) {
            let data = await response.json()
            this.get_all()
            return Task.fromRaw(data)
        } else {
            console.error("Error creating task");
            return response.status
        }
        
    
    }


    _current_to_create_body(): string | null {
        if (this.current_task !== null) {
        let dto = {
            name: this.current_task.name,
            description: this.current_task.description || "",
            due: this.current_task.due || null
            }
            return JSON.stringify(dto)
        }
        return null
    }

    _current_to_update_body(): string | null {
        if (this.current_task !== null) {
        let dto = {
            id: this.current_task.id, 
            name: this.current_task.name,
            description: this.current_task.description || "",
            due: this.current_task.due || null,
            status: STR_TO_STATUS[this.current_task.status],
            created_at: this.current_task.created_at?.toISOString(),
            updated_at: this.current_task.updated_at?.toISOString()
            
            }
            return JSON.stringify(dto)
        }
        return null
    }
    async get_by_id(id: string, set_current=false): Promise<Task> {
        if (!this.url) {
            return {} as Task
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        let url = this.url + id;
        let response: Response = await fetch(url);
        if (response.status === 200) {
            let raw_task = await response.json();
            let task = Task.fromRaw(raw_task)
            if (set_current) {
                this.current_task = task;
            }
            return task;
        }
        return {} as Task
    }

    async setDone(task: Task): Promise<Task> {
        this.current_task = task
        let result_task = await this.set_status(STR_TO_STATUS["Done"])
        return result_task
    }
    
    async setDeleted(task: Task): Promise<Task> {
        this.current_task = task   
        let result_task = await this.set_status(STR_TO_STATUS["Deleted"])
        return result_task
    }
    async setReactivated(task: Task): Promise<Task> {
        this.current_task = task   
        let result_task = await this.set_status(STR_TO_STATUS["Created"])
        return result_task
    }

    async set_status(status: number): Promise<Task> {
        if (this.current_task === null) {
            return {} as Task
        }
        if (!this.url) {
            return {} as Task
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        let url = this.url + `set/${this.current_task.id}/${status}`;
        let response: Response = await fetch(url);
        if (response.status === 200) {
            let raw_task = await response.json();
            this.get_all()
            let task = Task.fromRaw(raw_task)
            this.current_task = task
            return task;
        }
        return {} as Task
    }

    async do_text_search(needle: string) {
        if (!this.url) {
            return []
        }
        if (this.url && !this.url.endsWith("/")) {
            this.url += "/";
        }
        const url = this.url + "global?term=" + needle
        const response: Response = await fetch(url);
        const raw: Array<RawTask> = await response.json();
        this.loaded = []
        if (Array.isArray(raw)) {
            for (let i = 0; i < raw.length; i++) {
                const task = Task.fromRaw(raw[i]);
                this.loaded.push(task);
            }
        }
        this.updateAll()
        return this.loaded;
    }

    reset_search() {
        this.get_all().then()
    }
}
