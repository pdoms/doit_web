import Icon from '@mdi/react';
import React, {FC, useEffect, useState} from 'react';
import {preventDefaults} from '../utils';

interface IIconBtn {
    id: string
    mdiPath: string
    onClick?: (event: any) => void
    isActive?: boolean
    size?: string
}

export const IconBtn: FC<IIconBtn> = ({
    id,
    mdiPath,
    onClick,
    isActive,
    size
}) => {
    
    const [btnState, setBtnState] = useState("idle")
    const [size_, setSize_] = useState("16px")
    useEffect(() => {
        if (size) {
            setSize_(size)
        }  
    }, [size])


    return (
        <>
            <div 
                style={{width: size_, height: size_}}
                id={id} 
                className={`btn icn ${isActive ? "active" : ""}`}
                onMouseDown={preventDefaults}
                onClick={(event: any) => {
                    preventDefaults(event)
                    onClick && onClick(event)
                }}
                tabIndex={-1}       
                >
                <Icon path={mdiPath} size={size_}/>
            </div>
        </>
    )
}
