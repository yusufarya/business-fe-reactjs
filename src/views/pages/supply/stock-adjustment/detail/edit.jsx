import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import AppService from '../../../../../services/AppService';
import Language from '../../../../../utils/language';
import { useSelector } from 'react-redux';

const ModalEditData = ({ status, onModalStatusChange, stockAdjustmentDetailId, successUpdate }) => {
	const dataUser = useSelector((state) => state.dataUser);

	const [visible, setVisible] = useState(false);
	const [fixDataStockAdjustmentDetail, setFixDataStockAdjustmentDetail] = useState(null)
	const [stockAdjustmentDetailDetail, setStockAdjustmentDetailDetail] = useState(null)
	const [allBranchData, setAllBranchData] = useState(null)
	
	useEffect(() => {
		setVisible(status);
		const getDetailStockAdjustmentDetail = async () => {
			try {
				const result = await AppService.serviceGet('api/stock-adjustment-detail/get', {id:stockAdjustmentDetailId})
				setStockAdjustmentDetailDetail(result.data)
				setFixDataStockAdjustmentDetail(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDetailStockAdjustmentDetail()

		const getDataBranch = async () => {
			try {
				const result = await AppService.serviceGet('api/all-branch')
				setAllBranchData(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDataBranch()
	}, [status]);

	const handleClose = () => {
		setVisible(false);
		// Call the callback function to update the status in the parent component
		onModalStatusChange(false);
	};

	function handleInput(e) {
        setStockAdjustmentDetailDetail({...stockAdjustmentDetailDetail, [e.target.name]: e.target.value} ) 
    }

	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const qty = formData.get('qty');

		const stockAdjustmentDetailData = {
            id:fixDataStockAdjustmentDetail.id,
            qty: qty,
            qty_current: fixDataStockAdjustmentDetail.qty,
			username: dataUser.username
        }
        console.log(stockAdjustmentDetailData)

		try {
			const response = await AppService.ServicePatch('api/stock-adjustment-detail/update', stockAdjustmentDetailData)
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
			size="lg"
			visible={visible}
			onClose={handleClose}
			aria-labelledby="LiveDemoExampleLabel"
		>
			<CModalHeader onClose={handleClose}>
				<CModalTitle id="LiveDemoExampleLabel">{Language().LABEL_EDIT} Item {Language().LABEL_ADJUSTSTOCK} </CModalTitle>
			</CModalHeader>
			<CForm onSubmit={handleSubmit}>
				<CModalBody>
				{
					stockAdjustmentDetailDetail != null &&
					<>
					<div className="mb-3">
						<CFormLabel htmlFor="name">
							{Language().LABEL_NAME} {Language().lang == 'id' ? 'Produk': 'Product'}
						</CFormLabel>
						<CFormInput type="text" name="name" id="name" placeholder="PIECES" value={stockAdjustmentDetailDetail.product.name} onChange={(e) => handleInput(e)} readonly />
					</div>
					<div className="mb-3">
						<CFormLabel htmlFor="warehouse_id">{Language().LABEL_WAREHOUSE}</CFormLabel>
						<CFormInput type="text" name="warehouse_id" id="warehouse_id" placeholder="PIECES" value={stockAdjustmentDetailDetail.warehouse.name} onChange={(e) => handleInput(e)} readonly />
					</div>
					<CRow>
						<CCol>
							<div className="mb-3">
								<CFormLabel htmlFor="unit_id">{Language().LABEL_UNIT}</CFormLabel>
								<CFormInput type="text" name="unit_id" id="unit_id" placeholder="PIECES" value={stockAdjustmentDetailDetail.product.unit.initial} onChange={(e) => handleInput(e)} readonly />
							</div>
						</CCol>
						<CCol>
							<div className="mb-3">
								<CFormLabel htmlFor="qty">{Language().LABEL_QTY}</CFormLabel>
								<CFormInput type="text" name="qty" id="qty" placeholder="PIECES" value={stockAdjustmentDetailDetail.qty} onChange={(e) => handleInput(e)}/>
							</div>
						</CCol>
					</CRow>
					</>
				}
				</CModalBody>
				<CModalFooter>
					<CButton color="secondary" onClick={handleClose}>
						{Language().LABEL_CANCEL}
					</CButton>
					<CButton type='submit' color="primary">{Language().LABEL_SAVE}</CButton>
				</CModalFooter>
				
			</CForm>
		</CModal>
		</>
	);
};

export default ModalEditData;
