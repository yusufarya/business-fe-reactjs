import React, { useEffect, useRef, useState } from 'react'
import { CBadge, CButton, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'
import AppService from '../../../../services/AppService'
import { cilBell, cilBellExclamation, cilCheckCircle, cilInfo, cilPencil, cilTrash, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ModalEditData from './editData'
import ModalAddData from './addData'
import ModalDelete from './deleteData'
import Language from '../../../../utils/language'
import { Link } from 'react-router-dom'
import { format } from 'date-fns';

const Index = () => {

    const [warehouseData, setUnitData] = useState(null)
    const [action, setAction] = useState(null)
    const [rowData, setRowData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isSuccessUpdate, setIsSuccessUpdate] = useState(null)
    // const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getDataUnit = async () => {
            try {
                const result = await AppService.serviceGet('api/all-stock-adjustment')
                setUnitData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataUnit()
    }, [])

    const handleAddClick = () => {
        setVisible(!visible)
        setAction('add')
    }
    
    const handleDeleteClick = (numberTRSA) => {
        setVisible(!visible)
        setRowData({number:numberTRSA})
        setAction('delete')
    }

    const handleModalStatusChange = (visible) => {
        setVisible(visible);
    };

    const successUpdate = (response) => {
        setIsSuccessUpdate(response)
    }

    // console.log("====== isSuccessUpdate ======")
    // console.log(isSuccessUpdate)
    
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    const notifications = isSuccessUpdate!=null && (
        <CToast>
            <CToastHeader closeButton>
                {
                    isSuccessUpdate.status === 'success' ? 
                    <CIcon icon={cilCheckCircle} style={{marginRight: "5px", color:"green"}} /> 
                    : 
                    <CIcon icon={cilXCircle} style={{marginRight: "5px", color:"red"}} />
                }
                <div className="fw-bold me-auto">
                {isSuccessUpdate.status === 'success' ? "Success" : "Failed"}
                </div>
            {/* <small>7 min ago</small> */}
            </CToastHeader>
            <CToastBody>
                <span style={{color:"#2B547E"}}>{isSuccessUpdate.message}</span>
            </CToastBody>
        </CToast>
    )

    useEffect(() => {
        if(isSuccessUpdate) {
            addToast(notifications)
            const getDataUnit = async () => {
                try {
                    const result = await AppService.serviceGet('api/all-stock-adjustment')
                    setUnitData(result.data)
                    setIsSuccessUpdate(null)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            getDataUnit()
        }
    }, [isSuccessUpdate]);

    console.log(action)

    return (
        <div>
            <CRow>
                <CCol className="mb-3">
                    {Language().MENU_NAME_ADJUSTMENTSTOCK}
                </CCol>
                <CCol md={3} className="mb-3">
                    <Link to={`/page/supply/stock-adjustment/add`}>
                        <CButton color="primary" style={{float:'right'}} onClick={handleAddClick}>{Language().LABEL_ADD}</CButton>
                    </Link>
                </CCol>

                <CCol md={12}>
                    <CTable hover bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{width: '14%'}}>
                                {Language().lang == 'id' ? 'Nomor' : 'Number'}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_DATE}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_STOCK}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_TYPE}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_DESC}
                                </CTableHeaderCell>
                                <CTableHeaderCell style={{width: '15%', textAlign:'center'}}>
                                    {Language().LABEL_ACTION}
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        {
                            warehouseData != null &&
                            warehouseData.map((warehouse, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{warehouse.number}</CTableDataCell>
                                    <CTableDataCell>{format(new Date(warehouse.date), 'dd/MM/yyyy')}</CTableDataCell>
                                    <CTableDataCell>{warehouse.total_qty}</CTableDataCell>
                                    <CTableDataCell>{warehouse.type}</CTableDataCell>
                                    <CTableDataCell>{warehouse.description}</CTableDataCell>
                                    <CTableDataCell style={{textAlign:'center'}}>
                                        <Link to={`/page/supply/stock-adjustment/edit/${warehouse.number}`}>
                                            {/* <CButton color="info" size="sm">
                                                <CIcon style={{ color: 'azure' }} icon={cilInfo} />
                                            </CButton> */}
                                            <CButton color="warning" size="sm">
                                                <CIcon style={{color:'azure'}} icon={cilPencil}/>
                                            </CButton>
                                        </Link>
                                        &nbsp;&nbsp;
                                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(warehouse.number)}>
                                            <CIcon style={{color:'white'}} icon={cilTrash}/>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        }
                        </CTableBody>
                    </CTable>
                </CCol>
            </CRow>

            {action == 'add' &&
                (visible && <ModalAddData status={visible} onModalStatusChange={handleModalStatusChange} successUpdate={successUpdate}/>)
            }

            {action == 'edit' &&
                (visible && <ModalEditData status={visible} onModalStatusChange={handleModalStatusChange} stockAdjusId={rowData} successUpdate={successUpdate}/>)
            }

            {action == 'delete' &&
                (visible && <ModalDelete status={visible} onModalStatusChange={handleModalStatusChange} paramsStockAdjust={rowData} successUpdate={successUpdate} />)
            }
            
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>

    )
}

export default Index
