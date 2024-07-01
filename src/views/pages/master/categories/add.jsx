import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import AppService from '../../../../services/AppService';
import { useSelector } from 'react-redux';

const ModalAddData = ({ status, onModalStatusChange, successUpdate}) => {
    const dataUser = useSelector((state) => state.dataUser);

    const [visible, setVisible] = useState(false);
    const [categoryDataAdd, setBrandDataAdd] = useState(null);

    console.log(status)
    useEffect(() => {
        setVisible(status);
    }, [status]);

    const handleClose = () => {
        setVisible(false);
        // Call the callback function to update the status in the parent component
        onModalStatusChange(false);
    };

    function handleInput(e) {
        setBrandDataAdd({...categoryDataAdd, [e.target.name]: e.target.value} ) 
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log("=== SUBMIT ===")
        const categoryData = {
            ...categoryDataAdd,
            username: dataUser.username
        }

        try {
			const response = await AppService.ServicePost('api/category/create', categoryData)
			console.log(response)
			if(response.statusCode == 200) {
				successUpdate({'status':'success', 'message': response.message})
			} else {
                successUpdate({'status':'failed', 'message': 'Please check the form input.'})
				// successUpdate({'status':'failed', 'message': response.errorData.errors})
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
                <CModalTitle id="LiveDemoExampleLabel">Modal title</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					<>
                    <div className="mb-3">
                        <CFormLabel htmlFor="name">Name</CFormLabel>
                        <CFormInput type="text" name="name" id="name" placeholder="Enter Brand Name" onChange={(e) => handleInput(e)} required/>
                    </div>

					<div className="mb-3">
						<CFormLabel htmlFor="description">Description</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} onChange={(e) => handleInput(e)} placeholder='Enter text...'></CFormTextarea>
					</div>

					</>
				}

				</CModalBody>
				<CModalFooter>
					<CButton color="secondary" onClick={handleClose}>
						Close
					</CButton>
					<CButton type='submit' color="primary">Save Data</CButton>
				</CModalFooter>
				
			</CForm>
        </CModal>
        </>
    );
};

export default ModalAddData;
