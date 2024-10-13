import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';
import Language from '../../../../utils/language';
import { useSelector } from 'react-redux';

const ModalEditData = ({ status, onModalStatusChange, branchId, successUpdate }) => {
	const dataUser = useSelector((state) => state.dataUser);

	const [visible, setVisible] = useState(false);
	const [fixDataBranch, setFixDataBranch] = useState(null)
	const [branchDetail, setBranchDetail] = useState(null)

	useEffect(() => {
		setVisible(status);
		const getDetailBranch = async () => {
		try {
			const result = await AppService.serviceGet('api/branch/get', {id:branchId})
			setBranchDetail(result.data)
			setFixDataBranch(result.data)
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		}
		getDetailBranch()
	}, [status]);

	const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

	function handleInput(e) {
        setBranchDetail({...branchDetail, [e.target.name]: e.target.value} )
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') == "on" ? "Y" : "N";

		const branchData = {
            id:fixDataBranch.id,
            name: name,
            name_current: fixDataBranch.name,
            description: description,
            is_active: is_active,
			username: dataUser.username
        }
        console.log(branchData)

		try {
			const response = await AppService.ServicePatch('api/branch/update', branchData)
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
        <CModalTitle id="LiveDemoExampleLabel">{Language().LABEL_EDIT} {Language().LABEL_BRANCH}</CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					branchDetail != null &&
					<>
					<div className="mb-3">
						<CFormLabel htmlFor="name">{Language().LABEL_NAME}</CFormLabel>
						<CFormInput type="text" name="name" id="name" placeholder="PIECES" value={branchDetail.name} onChange={(e) => handleInput(e)}/>
					</div>
					<div className="mb-3">
						<CFormLabel htmlFor="phone">{Language().LABEL_PHONE}</CFormLabel>
						<CFormInput type="text" name="phone" id="phone" placeholder="PIECES" value={branchDetail.phone} onChange={(e) => handleInput(e)}/>
					</div>

					<div className="mb-3">
						<CFormLabel htmlFor="address">{Language().LABEL_ADDRESS}</CFormLabel>
						<CFormTextarea name="address" id="address" rows={2} value={branchDetail.address ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
					</div>

					<div className="mb-3">
						<CFormLabel htmlFor="description">{Language().LABEL_DESC}</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} value={branchDetail.description ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
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
