import React, { useState } from 'react';
import {AddTask} from '../add_task';
import {Listing} from '../listing';
import {DashBoardHeader} from './dashboardHeader';

export const Dashboard = () => {
    const [addActive, setAddActive] = useState(false)

    return (<>
        <div id={'dashboard'} className={'dashboard'} >
            <DashBoardHeader onAdd={setAddActive} discard={addActive === false}/>
            <div className={'dashboard-body'}>
                {addActive && 
                    <div>
                        <AddTask onDiscard={() => {
                            setAddActive(false)
                        }}/>
                    </div>}
                <Listing />
            </div>
        </div>
    </>)
}
