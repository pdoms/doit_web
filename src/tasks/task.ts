import {DateTime} from "../comps/datetime/datetime";
import {readDateFromRawTask} from "../utils";

export default class Task {
    id: string;
    name: string;
    status: string;
    description?: string | undefined;
    created_at?: Date | null | undefined;
    updated_at?: Date | null | undefined;
    due?: Date | null | undefined;


    

    constructor() {
        this.id = "";
        this.name = "";
        this.description = undefined;
        this.created_at = null;
        this.updated_at = null;
        this.status = "created"
        this.due = undefined
    }


    static fromRaw(raw: RawTask): Task {
        const tsk = new Task();
        tsk.id = raw.id;
        tsk.name = raw.name;
        tsk.status = tsk.status
        if (raw.description) {
            tsk.description = raw.description;
        }
        if (raw.created_at) {
            tsk.created_at = readDateFromRawTask(raw.created_at);
        }
        if (raw.updated_at) {
            tsk.updated_at = readDateFromRawTask(raw.updated_at);
        }
        if (raw.due) {
            tsk.due = readDateFromRawTask(raw.due)
        }
        if (raw.status) {
            tsk.status = raw.status
        }

        return tsk;
    }

    static empty(): Task {
         return new Task()
    }

    setName(name: string) {
        this.name = name
    }
    setDescription(description: string) {
        this.description = description
    }

    setDue(d: DateTime) {
        this.due = d.toJsDate()
    }

    setStatus(status: string) {
        this.status = status
    }
    getCreatedAt() {
        if (!this.created_at) {
            return "-"
        } else {
            return this.created_at.toLocaleString()
        }
    }
    getUpdatedAt() {
        if (!this.updated_at) {
            return "-"
        } else {
            return this.updated_at.toLocaleString()
        }
    }

    getDue() {
        if (!this.due) {
            return "-"
        } else {
            return this.due.toLocaleString()
        }
    }


     
}
