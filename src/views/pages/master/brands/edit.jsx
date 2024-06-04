import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';

const ModalEditData = ({ status, onModalStatusChange, brandId, successUpdate }) => {
	const [visible, setVisible] = useState(false);
	const [fixDataBrand, setFixDataBrand] = useState(null)
	const [brandDetail, setBrandDetail] = useState(null)
	
	useEffect(() => {
		setVisible(status);
		const getDetailBrand = async () => {
		try {
			const result = await AppService.serviceGet('api/brand/get', {id:brandId})
			setBrandDetail(result.data)
			setFixDataBrand(result.data)
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		}
		getDetailBrand()
	}, [status]);

	const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

	function handleInput(e) {
        setBrandDetail({...brandDetail, [e.target.name]: e.target.value} ) 
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') == "on" ? "Y" : "N";

		const brandData = {
            id:fixDataBrand.id,
            name: name,
            name_current: fixDataBrand.name,
            description: description,
            is_active: is_active,
			username: localStorage.getItem('username')
        }
        console.log(brandData)

		try {
			const response = await AppService.ServicePatch('api/brand/update', brandData)
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
				<CModalTitle id="LiveDemoExampleLabel">Edit Data Brand</CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					brandDetail != null &&
					<>
					<div className='row g-3'>
						<CCol>
                            <div className="mb-3">
                                <CFormLabel htmlFor="name">Name</CFormLabel>
                                <CFormInput type="text" name="name" id="name" placeholder="PIECES" value={brandDetail.name} onChange={(e) => handleInput(e)}/>
                            </div>
						</CCol>
						<CCol md={3}>
							<div className="mb-3">
								<CFormLabel htmlFor="is_active">Status</CFormLabel>
								<CFormCheck id="is_active" name='is_active' label="Active ?" defaultChecked={brandDetail.is_active === "Y"} />
							</div>
						</CCol>
					</div>

					<div className="mb-3">
						<CFormLabel htmlFor="description">Description</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} value={brandDetail.description ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
					</div>

					</>

				}
				</CModalBody>
				<CModalFooter>
					<CButton color="secondary" onClick={handleClose}>
						Close
					</CButton>
					<CButton type='submit' color="primary">Save changes</CButton>
				</CModalFooter>
				
			</CForm>
		</CModal>
		</>
	);
};

export default ModalEditData;
