import React, { useEffect, useState } from 'react';
import { CButton, CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';
import Language from '../../../../utils/language';

const ModalDeleteStockAdjust = ({status, onModalStatusChange, paramsStockAdjust, successUpdate}) => {
    console.log(paramsStockAdjust)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
		setVisible(status);
	}, [status]);

    const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await AppService.serviceDelete('api/stock-adjustment/delete', {number:paramsStockAdjust.number})
            console.log(response)
            if(response.statusCode == 200) {
				successUpdate({'status':'success', 'message': response.message.data})
			} else {
				successUpdate({'status':'failed', 'message': response.errorData.errors})
			}
            handleClose()
        } catch (error) {
            console.log('Error fetching data:');
			console.log(error)
        }
    }
    return (
        <>
            <CModal
                visible={visible}
                onClose={handleClose}
                aria-labelledby="LiveDemoExampleLabel"
            >
            <CModalHeader onClose={handleClose}>
				<CModalTitle id="LiveDemoExampleLabel">{Language().LABEL_DELETE} {Language().LABEL_ADJUSTSTOCK}</CModalTitle>
			</CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody>
                    {Language().LABEL_DELETE} {paramsStockAdjust.number} ?
                </CModalBody>
				<CModalFooter>
					<CButton color="secondary" onClick={handleClose}>
						Cancel
					</CButton>
					<CButton type='submit' color="primary">Yes</CButton>
				</CModalFooter>
            </CForm>
            </CModal>
        </>
    )
}

export default ModalDeleteStockAdjust