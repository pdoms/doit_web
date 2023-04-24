import React from 'react';
import { Dashboard } from './pages';
import { TasksContextProvider } from './contexts/tasksContext';

export const Entry = () => {
    return (
        <>
            <TasksContextProvider>
                <Dashboard />
            </TasksContextProvider>
        </>
    );
};
