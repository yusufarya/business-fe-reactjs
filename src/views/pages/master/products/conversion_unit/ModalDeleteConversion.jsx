import React, { useEffect, useState } from 'react';
import { CButton, CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../../services/AppService';

const ModalDeleteConversion = ({ status, onModalStatusChange, params, successDeleted }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(status);
    }, [status]);

    const handleClose = () => {
        setVisible(false);
        onModalStatusChange(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await AppService.serviceDelete('api/conversion-unit/delete', { id: params.id });
            if (response.statusCode === 200) {
                successDeleted({ status: 'success', message: response.message.data });
            } else {
                successDeleted({ status: 'failed', message: response.errorData.errors });
            }
            handleClose();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    return (
        <CModal
            visible={visible}
            onClose={handleClose}
        >
            <CModalHeader onClose={handleClose}>
                <CModalTitle>Delete Data Branch</CModalTitle>
            </CModalHeader>
            <CModalBody>
                Delete data {params.name}?
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={handleSubmit}>Yes</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ModalDeleteConversion;
