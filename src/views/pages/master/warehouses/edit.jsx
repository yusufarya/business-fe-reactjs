import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AppService from '../../../../services/AppService';
import Language from '../../../../utils/language';
import { useSelector } from 'react-redux';

const ModalEditData = ({ status, onModalStatusChange, warehouseId, successUpdate }) => {
	const dataUser = useSelector((state) => state.dataUser);

	const [visible, setVisible] = useState(false);
	const [fixDataWarehouse, setFixDataWarehouse] = useState(null)
	const [warehouseDetail, setWarehouseDetail] = useState(null)
	// const [allBranchData, setAllBranchData] = useState(null)
	
	useEffect(() => {
		setVisible(status);
		const getDetailWarehouse = async () => {
			try {
				const result = await AppService.serviceGet('api/warehouse/get', {id:warehouseId})
				setWarehouseDetail(result.data)
				setFixDataWarehouse(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDetailWarehouse()

		// const getDataBranch = async () => {
		// 	try {
		// 		const result = await AppService.serviceGet('api/all-branch')
		// 		setAllBranchData(result.data)
		// 	} catch (error) {
		// 		console.error('Error fetching data:', error);
		// 	}
		// }
		// getDataBranch()
	}, [status]);

	const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

	function handleInput(e) {
        setWarehouseDetail({...warehouseDetail, [e.target.name]: e.target.value} ) 
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const name = formData.get('name');
		const address = formData.get('address');
		const description = formData.get('description');
		const is_active = formData.get('is_active') == "on" ? "Y" : "N";

		const warehouseData = {
            id:fixDataWarehouse.id,
            name: name,
            name_current: fixDataWarehouse.name,
            address: address,
            description: description,
            is_active: is_active,
			username: dataUser.username
        }
        // console.log(warehouseData)

		try {
			const response = await AppService.ServicePatch('api/warehouse/update', warehouseData)
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
				<CModalTitle id="LiveDemoExampleLabel">Edit Data Warehouse</CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					warehouseDetail != null &&
					<>
					<div className="mb-3">
						<CFormLabel htmlFor="name">{Language().LABEL_NAME}</CFormLabel>
						<CFormInput type="text" name="name" id="name" placeholder="PIECES" value={warehouseDetail.name} onChange={(e) => handleInput(e)}/>
					</div>
					<div className="mb-3">
						<CFormLabel htmlFor="phone">{Language().LABEL_PHONE}</CFormLabel>
						<CFormInput type="text" name="phone" id="phone" placeholder="PIECES" value={warehouseDetail.phone} onChange={(e) => handleInput(e)}/>
					</div>

					{/* <div className="mb-3">
                        <CFormLabel htmlFor="branch_id">{Language().LABEL_BRANCH}</CFormLabel>
                        <CFormSelect name="branch_id" placeholder="Select branch" value={warehouseDetail.branch_id} onChange={(e) => handleInput(e)} required>
                         <option value={''}>Select branch</option>
                        {allBranchData != null &&
                            allBranchData.map((branch) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))
                        }
                        </CFormSelect>
                    </div> */}

					<div className="mb-3">
						<CFormLabel htmlFor="address">{Language().LABEL_ADDRESS}</CFormLabel>
						<CFormTextarea name="address" id="address" rows={2} value={warehouseDetail.address ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
					</div>

					<div className="mb-3">
						<CFormLabel htmlFor="description">{Language().LABEL_DESC}</CFormLabel>
						<CFormTextarea name="description" id="description" rows={2} value={warehouseDetail.description ?? ''} onChange={(e) => handleInput(e)}></CFormTextarea>
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
