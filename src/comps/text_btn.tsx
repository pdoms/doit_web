import Icon from '@mdi/react';
import React, {FC, useEffect, useState} from 'react';
import {preventDefaults} from '../utils';

interface ITextBtn {
    id: string
    text: string
    onClick?: (event: any) => void
    isActive?: boolean
    maxWidth?: number
}

export const TextBtn: FC<ITextBtn> = ({
    id,
    text,
    onClick,
    isActive,
    maxWidth 
}) => {
    
    const [btnState, setBtnState] = useState("idle")
    const [size_, setSize_] = useState("16px")
    const [maxWidth_, setMaxWidth_] = useState(90)
    useEffect(() => {
        if (maxWidth) {
            
        }  
    }, [maxWidth])

    useEffect(() => {
        if (isActive && isActive === true) {}
    }, [isActive])

    return (
        <>
            <div 
                id={id} 
                className={`btn-text`}
                onMouseDown={preventDefaults}
                onClick={(event: any) => {
                    preventDefaults(event)
                    onClick && onClick(event)
                }}
                style={{
                    maxWidth: maxWidth_
                }}
                tabIndex={-1}       
                >
                {text}
            </div>
        </>
    )
}
