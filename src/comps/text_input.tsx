import React, { FC, useEffect, useRef, useState } from 'react';
import Icon from "@mdi/react"
import {mdiClose} from '@mdi/js';
import {preventDefaults} from '../utils';

interface ITextInput {
    id: string | undefined
    onChange?: (event: any, value: string) => void
    onSubmit?: () => void
    onFocus?: () => void
    onBlur?: () => void
    onDelete?: () => void
    value: string
    label?: string
    placeholder?: string
    maxWidth?: string
    reset?: boolean
}

export const TextInput: FC<ITextInput> = ({
        id,
        onChange,
        onSubmit,
        onFocus,
        onBlur,
        value,
        label,
        placeholder,
        onDelete,
        maxWidth,
        reset
    }) => {
    const [value_,setValue_] = useState("")
    const [isInFocus,setIsInFocus] = useState(false)
    const el = useRef<any>(null)

    const handleChange = (event: any) => {
        setValue_(event.target.value)
        onChange && onChange(event, event.target.value)
    }

    useEffect(() => {
        setValue_(value)
    }, [value])

    useEffect(() => {
        if (reset) {
            setValue_("")
            setIsInFocus(false)
            el && el.current && el.current.blur()
        }
    }, [reset])

    return (
        <>
            <div id={id} 
                style={{maxWidth: maxWidth ? maxWidth : ""}}
            className="text-input-wrapper">
                {label && <div
                    className={`text-input-label ${isInFocus ? "focused" : ""}`}
                >{label}</div>}
                <div className={`text-input-box ${isInFocus ? "focused" : ""}`}>
                    <input
                        ref={el}
                        type={"text"}
                        className={`text-input ${isInFocus ? "focused" : ""}`}
                        onChange={handleChange}
                        value={value_}
                        placeholder={placeholder}
                        onFocus={
                            () => {
                                setIsInFocus(true)
                            }
                        }
                        onBlur={
                            () => {
                                setIsInFocus(false)
                            }
                        }
                    />
                    <div 
                        className={`text-input-btn-icon ${isInFocus ? "focused" : ""}`}
                        onMouseDown={preventDefaults}
                        onClick={(event: any) => {
                            preventDefaults(event)
                            onDelete && onDelete()
                            onChange && onChange(event, "")
                            setValue_("")
                            }
                        }
                        >
                        <Icon path={mdiClose} size={"16px"}/>
                    </div>
                </div>
            </div>
        </>
    )
}
