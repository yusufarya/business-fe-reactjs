import React, { useEffect, useRef, useState } from 'react'
import { CBadge, CButton, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'
import AppService from '../../../../services/AppService'
import { cilBell, cilBellExclamation, cilCheckCircle, cilPencil, cilTrash, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ModalEditData from './edit'
import ModalAddData from './add'
import ModalDelete from './delete'
import Language from '../../../../utils/language'

const Index = () => {

    const [action, setAction] = useState(null)
    const [categoryData, setUnitData] = useState(null)
    const [rowData, setRowData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isSuccessUpdate, setIsSuccessUpdate] = useState(null)
    // const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getDataUnit = async () => {
            try {
                const result = await AppService.serviceGet('api/all-category')
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
    const handleEditClick = (categoryId) => {
        setVisible(!visible)
        setRowData(categoryId)
        setAction('edit')
    }
    const handleDeleteClick = (categoryId, categoryName) => {
        setVisible(!visible)
        setRowData({id:categoryId, name:categoryName})
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
                    const result = await AppService.serviceGet('api/all-category')
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
                {Language().MENU_NAME_CATEGORY}
                </CCol>
                <CCol md={3} className="mb-3">
                    <CButton color="primary" style={{float:'right'}} onClick={handleAddClick}>{Language().LABEL_ADD}</CButton>
                </CCol>

                <CCol md={12}>
                    <CTable hover bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{width: '5%'}}>No.</CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_NAME}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_DESC}
                                </CTableHeaderCell>
                                <CTableHeaderCell style={{width: '12%', textAlign:'center'}}>
                                    {Language().LABEL_ACTION}
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        {
                            categoryData != null &&
                            categoryData.map((category, index) => (
                                <CTableRow key={category.id}>
                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                    <CTableDataCell>{category.name}</CTableDataCell>
                                    <CTableDataCell>{category.description}</CTableDataCell>
                                    {/* <CTableDataCell style={{textAlign:'center'}}>
                                        {
                                            category.is_active === 'Y' ? 
                                            <CBadge color="success">Active</CBadge> 
                                            : 
                                            <CBadge color="danger">Inactive</CBadge>
                                        }
                                    </CTableDataCell> */}
                                    <CTableDataCell style={{textAlign:'center'}}>
                                        <CButton color="warning" size="sm" onClick={() => handleEditClick(category.id)}>
                                            <CIcon style={{color:'azure'}} icon={cilPencil}/>
                                        </CButton>
                                        &nbsp;&nbsp;
                                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(category.id, category.name)}>
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
                (visible && <ModalEditData status={visible} onModalStatusChange={handleModalStatusChange} categoryId={rowData} successUpdate={successUpdate}/>)
            }

            {action == 'delete' &&
                (visible && <ModalDelete status={visible} onModalStatusChange={handleModalStatusChange} paramsBrand={rowData} successUpdate={successUpdate} />)
            }
            
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>

    )
}

export default Index
