import React, { FC, useEffect, useRef, useState } from 'react';
import Icon from "@mdi/react"
import {mdiClose} from '@mdi/js';

interface ITextArea {
    id: string | undefined
    onChange?: (event: any, value: string) => void
    onSubmit?: () => void
    onFocus?: () => void
    onBlur?: () => void
    value: string
    label?: string
    maxLength?: number 
    placeholder?: string
    maxWidth?: string
    minHeight?: string
    reset?: boolean
}

export const TextArea: FC<ITextArea> = ({
        id,
        onChange,
        onSubmit,
        onFocus,
        onBlur,
        value,
        label,
        placeholder,
        maxLength,
        maxWidth,
        minHeight, 
        reset
    }) => {

    const [value_,setValue_] = useState("")
    const [isInFocus,setIsInFocus] = useState(false)
    const [maxlength, setmaxLength] = useState(255)
    const [lengthError, setLengthError] = useState(false)
    const el = useRef<any>(null)
    
    useEffect(() => {
        if (maxLength) {
            setmaxLength(maxLength)
        }
    }, [maxLength])

    const handleChange = (event: any) => {
        if (event.target.value.length >= maxlength-1) {
            setLengthError(true)
            return
        } else {
            setLengthError(false)
        }
    
        setValue_(event.target.value)
        onChange && onChange(event, event.target.value)
    }

    useEffect(() => {
        setValue_(value)
    }, [value])

    useEffect(() => {
        if (reset) {
            setLengthError(false)
            setValue_("")
            setIsInFocus(false)
            el && el.current && el.current.blur()

        }
    }, [reset])

    return (
        <>
            <div id={id} className="text-input-wrapper">
                {label && <div
                    className={`text-input-label ${isInFocus ? "focused" : ""}`}
                >{label}</div>}
                <textarea
                    ref={el}
                    style={
                        {
                            maxWidth: maxWidth ? maxWidth : "280px",
                            minHeight: minHeight ? minHeight : "100px"
                        }
                    }
                    className={`text-area-input ${isInFocus ? "focused" : ""}`}
                    placeholder={placeholder}
                    value={value_}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsInFocus(true)
                    }}
                    onBlur={() => {
                        setIsInFocus(false)
                        setLengthError(false)
                    }}
                    maxLength={maxlength}
                />
                {lengthError && <div className={"error"}>Content too long (max. {maxlength} characters allowed).</div>}
            </div>
        </>
    )
}
