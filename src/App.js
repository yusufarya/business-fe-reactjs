import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import PageDisabled from './components/PageDisabled';
import FetchUserData from './components/FetchUserData';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
    const storedTheme = useSelector((state) => state.theme);
    const isLoggedIn = useSelector((state) => state.isLoggedIn);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
        if (theme) {
            setColorMode(theme);
        }

        if (isColorModeSet()) {
            return;
        }

        setColorMode(storedTheme);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [isPageDisabled, setIsPageDisabled] = useState(false);

    return (
        <BrowserRouter>
            <FetchUserData setIsPageDisabled={setIsPageDisabled} isLoggedIn={isLoggedIn} />
            {isPageDisabled && <PageDisabled message={isLoggedIn?.message} />}
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Routes>
                    {/* Redirect to home if already logged in and trying to access login page */}
                    <Route
                        exact
                        path="/login"
                        element={isLoggedIn?.status == 'success' ? <Navigate to="/" /> : <Login />}
                    />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/404" element={<Page404 />} />
                    <Route exact path="/500" element={<Page500 />} />
                    <Route path="*" element={<DefaultLayout />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
