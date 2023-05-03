import React from 'react';
import { Dashboard } from './pages';
import { TasksContextProvider } from './contexts/tasksContext';
import {DateTimePicker} from './comps';

export const Entry = () => {
    return (
        <>
            <TasksContextProvider>
                <Dashboard />
            </TasksContextProvider>
        </>
    );
};
