// src/components/PageDisabled.js
import React from 'react';

const PageDisabled = ({message}) => {
    return (
        <div style={overlayStyle}>
            <div style={messageStyle}>
                <h1>Sorry</h1>
                <p>{message}.</p>
            </div>
        </div>
    );
};

const overlayStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    zIndex: 1000,
};

const messageStyle = {
    textAlign: 'center',
};

export default PageDisabled;
