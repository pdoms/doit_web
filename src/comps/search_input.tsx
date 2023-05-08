import {FC, KeyboardEventHandler, useRef, useState} from "react"
import {mdiMagnify} from "@mdi/js"
import Icon from "@mdi/react"
import {preventDefaults} from "../utils"

interface ISearchInput {
    id: string
    onChange?: (val: string, event: any) => void
    onSearch: (val: string, event: any) => void
    onAbort: () => void
    resLen: number | null
    title: string
}

export const SearchInput: FC<ISearchInput> = ({
    id,
    onChange,
    onSearch,
    onAbort,
    resLen,
    title
}) => {
    const [value, setValue] = useState("")
    const [isInFocus, setIsInFocus] = useState(false)
    const el = useRef<any>()

    const handleChange = (event: any) => {
        let v = event.target.value
        setValue(v)
        onChange && onChange(v, event)
    }

    const handleKeys = (event: any) => {
        let key = event.key
        if (key === "Backspace" && value.length === 0) {
            if (el && el.current) {
                el.current.blur()
                onAbort()
                    
            }
        }

        if (key === "Enter" && value.length > 0) {
            onSearch(value, event)
        }

        if (key === "Escape") {
            setValue("")
            onAbort()
        }
    }


    return (<>
        <div
            onKeyDown={handleKeys}
            id={id}
            className="search-input-wrapper"
            title={title}
            >
            <div className={`search-input-box`}>
                <input 
                    ref={el}
                    className={`search-input ${isInFocus ? "focused" : ""}`}
                    onFocus={() => {
                        setIsInFocus(true)
                    }}
                    onBlur={() => {
                        setIsInFocus(false)
                    }}
                    placeholder={"search..."}
                    value={value}
                    onChange={handleChange}
                />
                <div 
                    className={`search-input-btn ${isInFocus ? "focused" : ""}`}
                    onMouseDown={preventDefaults}
                    onClick={(event: any) => {
                        preventDefaults(event)
                        if (value.length > 0) {
                            onSearch(value, event)
                        }
                    }}
                    >
                    <Icon path={mdiMagnify} size={"18px"}/>
                </div>
            </div>
            {resLen !== null && <div className="search-results">Results: {resLen}</div>}
        </div>
    </>)
}
