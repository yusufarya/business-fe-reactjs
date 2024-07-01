import React, { useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormInput, CFormSelect, CCol, CRow } from '@coreui/react';
import { cilPencil, cilTrash, cilPlus, cilX } from '@coreui/icons';
import CIcon from "@coreui/icons-react";
import Language from '../../../../../utils/language';
import AppService from '../../../../../services/AppService';
import { useSelector } from 'react-redux';

const ConversionTable = ({ conversionUnitData, unitData, idProduct, setIsMultipleUnit, setIsSuccessCreate }) => {
    const dataUser = useSelector((state) => state.dataUser);

    const [editingIndex, setEditingIndex] = useState(null);
    const [addRowConversion, setAddRowConversion] = useState(false)
    const [formData, setFormData] = useState([]);
    const [conversionUnits, setConversionUnits] = useState([]);

    const handleAddConversion = () => {
        setAddRowConversion(true)
    }

    const handleInputChangeAdd = (event) => {
        const { name, value } = event.target;
        setConversionUnits({ 
            ...conversionUnits,
            [name]: value }
        );
    }

    const handleBtnAddConversion = async () => {
        const conversionParams = {
            ...conversionUnits,
            product_id: idProduct,
            username : dataUser.username
        }
        console.log(conversionParams)
        const response = await AppService.ServicePost('api/conversion-unit/create', conversionParams);
        console.log(response)
        if(response.statusCode == 200) {
            console.log(response.message)
            setIsMultipleUnit(true)
            setAddRowConversion(false)
            setIsSuccessCreate({'status':'success', 'message': response.message})
        } else {
            setIsSuccessCreate({'status':'failed', 'message': 'Please check the form input.'})
        }
    }

    const handleEditClick = (index, conversion) => {
        const { created_at, created_by, updated_at, updated_by, ...updatedConversion } = conversion;
        setEditingIndex(index);
        setFormData(updatedConversion);
    };

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSaveClick = (index) => {
        console.log('SAVE CLICKER')
        console.log(formData)
        SaveConversion(index, formData);
        setEditingIndex(null);
    };

    const SaveConversion = async (index, formData) => {
        console.log( "===== SAVE =====")
        const conversionParams = {
            ...formData,
            username: dataUser.username,
        }
        console.log(conversionParams)
        const response = await AppService.ServicePatch('api/conversion-unit/update', conversionParams);
        console.log(response)
        if(response.statusCode == 200) {
            console.log(response.message)
            setIsMultipleUnit(true)
            setAddRowConversion(false)
            setIsSuccessCreate({'status':'success', 'message': response.message})
        } else {
            setIsSuccessCreate({'status':'failed', 'message': 'Please check the form input.'})
        }
    }

    return (
        conversionUnitData.length > 0 && (
            <CCol md={12}>
                <CRow className='pb-1'>
                    <CCol>
                        <strong>Multi Satuan</strong>
                    </CCol>
                    <CCol>
                        <CButton style={{ float: 'right' }} size='sm' color='primary' onClick={handleAddConversion}>
                            <b>+</b> {Language().LABEL_UNIT}
                        </CButton>
                    </CCol>
                </CRow>
                <CTable bordered>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell style={{ width: '7%' }}>No.</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: '13%' }}>{Language().LABEL_UNIT}</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: '13%' }}>{Language().LABEL_QTY}</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{Language().LABEL_PURCHASE_PRICE}</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{Language().LABEL_SELLING_PRICE}</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: '14%', textAlign: 'center' }}>{Language().LABEL_ACTION}</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {conversionUnitData.map((conversion, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{index + 1}.</CTableDataCell>
                                <CTableDataCell>
                                    {editingIndex === index ? (
                                        <CFormSelect name="conversion_unit" value={formData.conversion_unit} onChange={handleInputChangeEdit}>
                                            <option value="">Select</option>
                                            {unitData && unitData.map((item, i) => (
                                                <option value={item.initial} key={i}>{item.initial}</option>
                                            ))}
                                        </CFormSelect>
                                    ) : (
                                        conversion.conversion_unit
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {editingIndex === index ? (
                                        <CFormInput
                                            type="text"
                                            name="qty"
                                            value={formData.qty}
                                            onChange={handleInputChangeEdit}
                                        />
                                    ) : (
                                        conversion.qty
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {editingIndex === index ? (
                                        <CFormInput
                                            type="text"
                                            name="purchase_price"
                                            value={formData.purchase_price}
                                            onChange={handleInputChangeEdit}
                                        />
                                    ) : (
                                        conversion.purchase_price
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {editingIndex === index ? (
                                        <CFormInput
                                            type="text"
                                            name="selling_price"
                                            value={formData.selling_price}
                                            onChange={handleInputChangeEdit}
                                        />
                                    ) : (
                                        conversion.selling_price
                                    )}
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {index + 1 > 1 && (
                                        <>
                                            {editingIndex === index ? (
                                                <CButton color="success" size="sm" onClick={() => handleSaveClick(index)}>
                                                    Save
                                                </CButton>
                                            ) : (
                                                <>
                                                    <CButton color="warning" size="sm" onClick={() => handleEditClick(index, conversion)}>
                                                        <CIcon style={{ color: 'azure' }} icon={cilPencil} />
                                                    </CButton>
                                                    &nbsp;&nbsp;
                                                    <CButton color="danger" size="sm" onClick={() => handleDeleteClick(conversion.id, conversion.unit)}>
                                                        <CIcon style={{ color: 'white' }} icon={cilTrash} />
                                                    </CButton>
                                                </>
                                            )}
                                        </>
                                    )}
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                        {addRowConversion && (
                            <CTableRow key={conversionUnitData.length}>
                                <CTableDataCell>{conversionUnitData.length + 1}.</CTableDataCell>
                                <CTableDataCell>
                                    <CFormSelect name="conversion_unit" defaultValue={''} onChange={handleInputChangeAdd}>
                                        <option value="">Select</option>
                                        {unitData && unitData.map((item, i) => (
                                            <option value={item.initial} key={i}>{item.initial}</option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormInput type="text" name="qty" defaultValue={0} onChange={handleInputChangeAdd} />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormInput type="text" name="purchase_price" defaultValue={0} onChange={handleInputChangeAdd} />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormInput type="text" name="selling_price" defaultValue={0} onChange={handleInputChangeAdd} />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <CButton type='button' color="success" size="sm" onClick={handleBtnAddConversion}>
                                        <CIcon style={{ color: 'azure' }} icon={cilPlus} />
                                    </CButton>
                                    <CButton type='button' color="danger" size="sm">
                                        <CIcon style={{ color: 'azure' }} icon={cilX} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </CCol>
        )
    );
};

export default ConversionTable;
