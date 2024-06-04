import React, { useEffect, useRef, useState } from 'react'
import { CBadge, CButton, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'
import AppService from '../../../../services/AppService'
import { cilBell, cilBellExclamation, cilCheckCircle, cilInfo, cilPencil, cilTrash, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ModalEditData from './editData'
import ModalAddData from './addData'
import Language from '../../../../utils/language'
import { Link } from 'react-router-dom'
import ModalDeleteProduct from './deleteData'

const Index = () => {

    const [productData, setProductData] = useState(null)
    const [action, setAction] = useState(null)
    const [rowData, setRowData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isSuccessUpdate, setIsSuccessUpdate] = useState(null)
    // const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getDataProduct = async () => {
            try {
                const result = await AppService.serviceGet('api/all-product')
                setProductData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataProduct()
    }, [])

    const handleAddClick = () => {
        setVisible(!visible)
        setAction('add')
    }
    
    const handleDeleteClick = (id, name) => {
        setVisible(!visible)
        setRowData({id:id, name:name})
        setAction('delete')
    }

    const handleModalStatusChange = (visible) => {
        setVisible(visible);
    };

    const successUpdate = (response) => {
        setIsSuccessUpdate(response)
    }
 
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
            const getDataProduct = async () => {
                try {
                    const result = await AppService.serviceGet('api/all-product')
                    setProductData(result.data)
                    setIsSuccessUpdate(null)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            getDataProduct()
        }
    }, [isSuccessUpdate]);

    console.log(action)

    let no = 1;

    return (
        <div>
            <CRow>
                <CCol className="mb-3">
                    {Language().MENU_NAME_PRODUCT}
                </CCol>
                <CCol md={3} className="mb-3">
                    <Link to={`/page/master/products/add`}>
                        <CButton color="primary" style={{float:'right'}} onClick={handleAddClick}>{Language().LABEL_ADD}</CButton>
                    </Link>
                </CCol>

                <CCol md={12}>
                    <CTable hover bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{width: '4%'}}>No.</CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_NAME}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_CATEGORY}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_BRAND}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_UNIT}
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                    {Language().LABEL_DESC}
                                </CTableHeaderCell>
                                <CTableHeaderCell style={{width: '8%', textAlign:'center'}}>Status</CTableHeaderCell>
                                <CTableHeaderCell style={{width: '10%', textAlign:'center'}}>
                                    {Language().LABEL_ACTION}
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        {
                            productData != null &&
                            productData.map((product, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{no++}</CTableDataCell>
                                    <CTableDataCell>{product.name}</CTableDataCell>
                                    <CTableDataCell>{product.category.name}</CTableDataCell>
                                    <CTableDataCell>{product.brand.name}</CTableDataCell>
                                    <CTableDataCell>{product.unit.initial}</CTableDataCell>
                                    <CTableDataCell>{product.description}</CTableDataCell>
                                    <CTableDataCell style={{textAlign:'center'}}>
                                    {
                                        product.is_active === 'Y' ? 
                                        <CBadge color="success">Active</CBadge> 
                                        : 
                                        <CBadge color="danger">Inactive</CBadge>
                                    }
                                    </CTableDataCell>
                                    <CTableDataCell style={{textAlign:'center'}}>
                                        <Link to={`/page/master/products/edit/${product.id}`}>
                                            {/* <CButton color="info" size="sm">
                                                <CIcon style={{ color: 'azure' }} icon={cilInfo} />
                                            </CButton> */}
                                            <CButton color="warning" size="sm">
                                                <CIcon style={{color:'azure'}} icon={cilPencil}/>
                                            </CButton>
                                        </Link>
                                        &nbsp;&nbsp;
                                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(product.id, product.name)}>
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
                (visible && <ModalDeleteProduct status={visible} onModalStatusChange={handleModalStatusChange} product={rowData} successUpdate={successUpdate} />)
            }
            
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>

    )
}

export default Index