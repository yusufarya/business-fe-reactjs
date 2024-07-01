import React, { useState } from 'react';
import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import Language from "../../../../utils/language";
import CIcon from "@coreui/icons-react";
import { cibAddthis } from "@coreui/icons";
import AppService from "../../../../services/AppService";
import { useSelector } from 'react-redux';

const AddDataStockAdjustment = () => {
    const dataUser = useSelector((state) => state.dataUser);

    const [visibleAddItem, setVisibleAddItem] = useState(false);
    const [visibleAddDetail, setVisibleAddDetail] = useState(true);
    const [visibleSubmit, setVisibleSubmit] = useState(false);
    const [visibleTable, setVisibleTable] = useState(false);
    const [numberTR, setNumberTR] = useState('SAXXXXXXXXX'); // Initial value for numberTR
    const [dataHeader, setDataHeader] = useState(null);
    const [action, setAction] = useState(null);
    const [rowData, setRowData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [isSuccessUpdate, setIsSuccessUpdate] = useState(null)

    // Function to handle input changes in dataHeader state
    function handleInputHeader(e) {
        const { name, value } = e.target;
        setDataHeader((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    // Function to handle form submission and API call
    const handleAddDetail = async (e) => {
        e.preventDefault();
        const paramsHeader = {
            ...dataHeader,
            branch_id: localStorage.getItem('currentBranch'),
            username: dataUser.username
        };

        try {
            const response = await AppService.ServicePost('api/stock-adjustment/create', paramsHeader);
            console.log(response);
            if (response.statusCode === 200) {
                setVisibleAddDetail(false);
                setVisibleTable(true);
                setVisibleAddItem(true);
                setVisibleSubmit(true);
                const newNumberTR = response.message.data.number;
                setNumberTR(newNumberTR); // Update numberTR with the new value from API response
                setDataHeader((prevData) => ({
                    ...prevData,
                    number: newNumberTR
                })); // Update dataHeader.number as well
            } else {
                // Handle error or show error message
            }
        } catch (error) {
            console.log('Error fetching data:');
            console.log(error);
        }
    };

    // Function to handle final form submission (if needed)
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle final form submission logic here
    };

    // Current date object to set default date in date input field
    const dateObject = new Date();
    // Format the date as "YYYY-MM-DD" (assuming you want this format)
    const dateTransaction = dateObject.toISOString().split('T')[0];

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

    return (
        <div>
            <CRow>
                <CCol className="mb-3">
                    {Language().MENU_NAME_ADJUSTMENTSTOCK}
                </CCol>
                <CCol md={3} className="mb-3"></CCol>
            </CRow>

            <CForm className="row g-3" onSubmit={handleSubmit}>
                <CCol md={4}>
                    <CFormInput
                        type="text"
                        value={dataHeader?.number || numberTR} // Bind input field value to numberTR state
                        name="number"
                        id="number"
                        label={Language().LABEL_NUMBER}
                        onChange={(e) => handleInputHeader(e)}
                        disabled
                        required
                    />
                </CCol>

                <CCol md={4}>
                    <CFormInput
                        type="date"
                        value={dataHeader?.date || dateTransaction}
                        name="date"
                        id="date"
                        label={Language().LABEL_DATE}
                        onChange={(e) => handleInputHeader(e)}
                        readOnly={!visibleAddDetail}
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormSelect
                        name="type"
                        id="type"
                        label="Type"
                        value={dataHeader?.type}
                        onChange={(e) => handleInputHeader(e)}
                        readOnly={!visibleAddDetail}
                        required
                    >
                        <option value="">Select</option>
                        <option value="in">In</option>
                        <option value="out">Out</option>
                    </CFormSelect>
                </CCol>
                <CCol md={8}>
                    <CFormInput
                        type="text"
                        value={dataHeader?.description}
                        name="description"
                        id="description"
                        label={Language().LABEL_DESC}
                        onChange={(e) => handleInputHeader(e)}
                        readOnly={!visibleAddDetail}
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <br />
                    {visibleAddDetail && 
                        <CButton className="mt-2" color="info" type="submit" onClick={(e) => handleAddDetail(e)} style={{ color: 'white' }}>
                            <CIcon icon={cibAddthis} style={{ color: 'white' }} /> Detail
                        </CButton>
                    }
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
                    {visibleTable && (
                        <CTable hover bordered>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell style={{ width: '5%' }}>No.</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        {Language().LABEL_NAME} {Language().lang === 'id' ? 'Produk' : 'Product'}
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
                                    <CTableHeaderCell style={{ width: '15%', textAlign: 'center' }}>
                                        {Language().LABEL_ACTION}
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody></CTableBody>
                        </CTable>
                    )}
                </CCol>

                <CCol xs={12}>
                    {visibleSubmit && (
                        <CButton color="primary" type="submit">
                            Submit form
                        </CButton>
                    )}
                </CCol>
            </CForm>

            <br />

            {/* Assuming these are components rendered conditionally based on `action` */}
        </div>
    );
};

export default AddDataStockAdjustment;
