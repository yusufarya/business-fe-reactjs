// src/components/PageDisabled.js
import React from 'react';
import Language from '../utils/language';

const PageDisabled = ({message}) => {
    return (
        <div style={overlayStyle}>
            <div style={messageStyle}>
                <h1 style={{fontSize: '26px !important', fontWeight: '600'}}>{Language().lang == 'id' ? 'Maaf': 'Sorry'}</h1>
                <p style={{fontSize: '16px !important'}}>{message}.</p>
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
