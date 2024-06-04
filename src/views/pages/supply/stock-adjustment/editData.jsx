import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import Language from "../../../../utils/language"
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppService from "../../../../services/AppService";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import ModalAddData from "./detail/add";
import ModalEditData from "./detail/edit";
import ModalDelete from "./detail/delete";

const EditDataStockAdjustment = () => {
    let { number } = useParams();
    
    const [visibleAddItem, setVisibleAddItem] = useState(false);
    const [visibleAddDetail, setVisibleAddDetail] = useState(true);
    const [visibleSubmit, setVisibleSubmit] = useState(false);
    const [visibleTable, setVisibleTable] = useState(false);
    const [allBranchData, setAllBranchData] = useState(null)
    const [detailTransaction, setDetailTransaction] = useState(null)
    const [action, setAction] = useState(null)
    const [rowData, setRowData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isSuccessUpdate, setIsSuccessUpdate] = useState(null)
    
    useEffect(() => {
		const getDetailWarehouse = async () => {
			try {
				const result = await AppService.serviceGet('api/stock-adjustment/get', {number:number})
                setDetailTransaction(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDetailWarehouse()

		const getDataBranch = async () => {
			try {
				const result = await AppService.serviceGet('api/all-branch')
				setAllBranchData(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDataBranch()
	}, []);

    console.log(detailTransaction)
    
    if(detailTransaction != null) {
        var dateObject = new Date(detailTransaction.date);
        // Format the date as "YYYY-MM-DD" (assuming you want this format)
        var dateTransaction = dateObject.toISOString().split('T')[0];
    } else {var dateTransaction = ''}

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }
    
    const handleAddClick = () => {
        setVisible(!visible)
        setAction('add')
    }
    const handleEditClick = (stockAdjustmentDetailId) => {
        setVisible(!visible)
        setRowData(stockAdjustmentDetailId)
        setAction('edit')
    }
    const handleDeleteClick = (stockAdjustmentDetailId, warehouseName) => {
        setVisible(!visible)
        setRowData({id:stockAdjustmentDetailId, name:warehouseName})
        setAction('delete')
    }

    const handleModalStatusChange = (visible) => {
        setVisible(visible);
    };

    const successUpdate = (response) => {
        setIsSuccessUpdate(response)
    }

    var no = 1;

    return (
        <div>
            <CRow>
                <CCol className="mb-3">
                    {Language().MENU_NAME_ADJUSTMENTSTOCK}
                </CCol>
                <CCol md={3} className="mb-3">
                
                </CCol>
            </CRow>
            {
                detailTransaction != null &&
                <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >
                    <CCol md={4}>
                    <CFormInput
                        type="text"
                        defaultValue={detailTransaction.number}
                        feedbackValid="Looks good!"
                        id=""
                        label={Language().LABEL_NUMBER}
                        required
                    />
                    </CCol>
                    
                    <CCol md={4}>
                    <CFormInput
                        type="date"
                        defaultValue={dateTransaction}
                        feedbackValid="Looks good!"
                        id="validationCustom02"
                        label={Language().LABEL_DATE}
                        required
                    />
                    </CCol>
                    <CCol md={4}>
                    <CFormSelect
                        aria-describedby="validationCustom04Feedback"
                        feedbackInvalid="Please select a valid state."
                        id="validationCustom04"
                        label="Type"
                        defaultValue={detailTransaction.type}
                        required
                    >
                        <option disabled>Select</option>
                        <option value={"in"}>In</option>
                        <option value={"out"}>Out</option>
                    </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                    <CFormInput
                        type="text"
                        defaultValue={detailTransaction.description}
                        aria-describedby="validationCustom03Feedback"
                        feedbackInvalid="Please provide a valid city."
                        id="validationCustom03"
                        label={Language().LABEL_DESC}
                        required
                    />
                    </CCol>

                    <CCol md={10}></CCol>
                    <CCol md={2}>
                        {visibleAddItem &&
                            <CButton className="mt-2" color="info" type="submit" onClick={(e) => handleAddClick(e)} style={{ float: 'right' }}>
                                <CIcon icon={cibAddthis} style={{ color: 'whitesmoke' }} />
                            </CButton>
                        }
                    </CCol>
                    
                    <CCol md={12}>
                        <CTable hover bordered>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell style={{width: '5%'}}>No.</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        {Language().LABEL_NAME} {Language().lang == 'id'? 'Produk' : 'Product'}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        {Language().LABEL_WAREHOUSE}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        {Language().LABEL_UNIT}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        {Language().LABEL_QTY}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell style={{width: '15%', textAlign:'center'}}>
                                        {Language().LABEL_ACTION}
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                            {
                                detailTransaction.stockAdjustmentDetail != null &&
                                detailTransaction.stockAdjustmentDetail.map((detailTRSA, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{no++}</CTableDataCell>
                                        <CTableDataCell>{detailTRSA.product.name}</CTableDataCell>
                                        <CTableDataCell>{detailTRSA.warehouse.name}</CTableDataCell>
                                        <CTableDataCell>{detailTRSA.product.unit.initial}</CTableDataCell>
                                        <CTableDataCell>{detailTRSA.qty}</CTableDataCell>
                                        <CTableDataCell style={{textAlign:'center'}}>
                                            <CButton color="warning" size="sm" onClick={() => handleEditClick(detailTRSA.id)}>
                                                <CIcon style={{color:'azure'}} icon={cilPencil}/>
                                            </CButton>
                                            &nbsp;&nbsp;
                                            <CButton color="danger" size="sm" onClick={() => handleDeleteClick(detailTRSA.id, detailTRSA.product.name)}>
                                                <CIcon style={{color:'white'}} icon={cilTrash}/>
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                    
                                ))
                            }
                            </CTableBody>
                        </CTable>
                    </CCol>

                    <CCol xs={12}>
                    <CButton color="primary" type="submit">
                        Submit form
                    </CButton>
                    </CCol>
                </CForm>
            }
            <br></br>
            
            {action == 'add' &&
                (visible && <ModalAddData status={visible} onModalStatusChange={handleModalStatusChange} successUpdate={successUpdate}/>)
            }
    
            {action == 'edit' &&
                (visible && <ModalEditData status={visible} onModalStatusChange={handleModalStatusChange} stockAdjustmentDetailId={rowData} successUpdate={successUpdate}/>)
            }
    
            {action == 'delete' &&
                (visible && <ModalDelete status={visible} onModalStatusChange={handleModalStatusChange} paramsWarehouse={rowData} successUpdate={successUpdate} />)
            }
        </div>
    )
}

export default EditDataStockAdjustment