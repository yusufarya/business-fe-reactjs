import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';

const ModalEditData = ({ status, onModalStatusChange, unitId, successUpdate }) => {
	const [visible, setVisible] = useState(false);
	const [fixDataUnit, setFixDataUnit] = useState(null)
	const [unitDetail, setUnitDetail] = useState(null)

	useEffect(() => {
		setVisible(status);
		const getDetailUnit = async () => {
		try {
			const result = await AppService.serviceGet('api/unit/get', {id:unitId})
			setUnitDetail(result.data)
			setFixDataUnit(result.data)
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		}
		getDetailUnit()
	}, [status]);

	const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

	const handleDescriptionChange = (e) => {
		setUnitDetail({ ...unitDetail, description: e.target.value });
	};

	function handleInput(e) {
        setUnitDetail({...unitDetail, [e.target.name]: e.target.value} ) 
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const initial = formData.get('initial');
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') == "on" ? "Y" : "N";

		const unitData = {
			id: unitDetail.id,
			initial: initial,
			initial_current: fixDataUnit.initial,
			name: name,
			description: description,
			is_active: is_active,
			username: localStorage.getItem('username')
		}

		try {
			const response = await AppService.ServicePatch('api/unit/update', unitData)
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
	console.log(unitDetail.is_active)
	return (
		<>
		<CModal
			visible={visible}
			onClose={handleClose}
			aria-labelledby="LiveDemoExampleLabel"
		>
			<CModalHeader onClose={handleClose}>
				<CModalTitle id="LiveDemoExampleLabel">Edit Data Unit</CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					unitDetail != null &&
					<>
					<div className='row g-3'>
						<CCol md={6}>
							<div className="mb-3">
								<CFormLabel htmlFor="initial">Initial</CFormLabel>
								<CFormInput type="text" name="initial" id="initial" placeholder="PCS" value={unitDetail.initial} onChange={(e) => handleInput(e)}/>
							</div>
						</CCol>
						<CCol md={6}>
							<div className="mb-3">
								<CFormLabel htmlFor="is_active">Status</CFormLabel>
								<CFormCheck id="is_active" name='is_active' label="Active ?" defaultChecked={unitDetail.is_active === "Y"} />
							</div>
						</CCol>
					</div>
					
					<div className="mb-3">
						<CFormLabel htmlFor="name">Name</CFormLabel>
						<CFormInput type="text" name="name" id="name" placeholder="PIECES" value={unitDetail.name} onChange={(e) => handleInput(e)}/>
					</div>
					<div className="mb-3">
						<CFormLabel htmlFor="description">Description</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} value={unitDetail.description} onChange={handleDescriptionChange}></CFormTextarea>
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
