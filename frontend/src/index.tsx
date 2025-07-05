import React from 'react';
import ReactDOM from 'react-dom/client';
import Welcome from './pages/Welcome';
import {makeServer} from './mocks/server';

if (process.env.NODE_ENV === 'development') {
    makeServer();
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Welcome/>
    </React.StrictMode>
);
