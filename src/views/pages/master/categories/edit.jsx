import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';
import { useSelector } from 'react-redux';

const ModalEditData = ({ status, onModalStatusChange, categoryId, successUpdate }) => {
	const dataUser = useSelector((state) => state.dataUser);

	const [visible, setVisible] = useState(false);
	const [fixDataBrand, setFixDataBrand] = useState(null)
	const [categoryDetail, setBrandDetail] = useState(null)
	
	useEffect(() => {
		setVisible(status);
		const getDetailBrand = async () => {
		try {
			const result = await AppService.serviceGet('api/category/get', {id:categoryId})
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
        setBrandDetail({...categoryDetail, [e.target.name]: e.target.value} ) 
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const name = formData.get('name');
		const description = formData.get('description');

		const categoryData = {
            id:fixDataBrand.id,
            name: name,
            name_current: fixDataBrand.name,
            description: description,
			username: dataUser.username
        }
        // console.log(categoryData)

		try {
			const response = await AppService.ServicePatch('api/category/update', categoryData)
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
				<CModalTitle id="LiveDemoExampleLabel">Edit Data Brand</CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					categoryDetail != null &&
					<>
					<div className="mb-3">
						<CFormLabel htmlFor="name">Name</CFormLabel>
						<CFormInput type="text" name="name" id="name" placeholder="PIECES" value={categoryDetail.name} onChange={(e) => handleInput(e)}/>
					</div>

					<div className="mb-3">
						<CFormLabel htmlFor="description">Description</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} value={categoryDetail.description ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
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
