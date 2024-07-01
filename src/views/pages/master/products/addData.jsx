import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster} from "@coreui/react";
import Language from "../../../../utils/language";
import CIcon from "@coreui/icons-react";
import AppService from "../../../../services/AppService";
import { cilCheckCircle, cilPencil, cilPlus, cilTrash, cilX, cilXCircle } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import FormaterHelper from '../../../../utils/fotmaterHelper';
import { useSelector } from 'react-redux';
import ConversionTable from './conversion_unit/conversionUnitTable';

const AddDataProduct = () => {
    const dataUser = useSelector((state) => state.dataUser);
    const navigate = useNavigate()

    const [dataForm, setDataForm] = useState(null)
    const [unitData, setUnitData] = useState(null)
    const [conversionUnitData, setConversionUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState(null)
    const [brandData, setBrandData] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [isSuccessCreate, setIsSuccessCreate] = useState(null)
    const [validationError, setValidationError] = useState([])
    const [idProduct, setIdProduct] = useState(null)
    const [isMultipleUnit, setIsMultipleUnit] = useState(false)
    const [addRowConversion, setAddRowConversion] = useState(false)
    
    useEffect(() => {
        const getDataCategory = async () => {
            try {
                const result = await AppService.serviceGet('api/all-category')
                setCategoryData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataCategory()
        const getDataBrand = async () => {
            try {
                const result = await AppService.serviceGet('api/all-brand')
                setBrandData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataBrand()
        const getDataUnit = async () => {
            try {
                const result = await AppService.serviceGet('api/all-unit')
                setUnitData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDataUnit()
    }, [])

    const handleInputImage = async (e) => {
        const file = e.target.files[0]; // Get the selected file from the input
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                console.log(formData)

                // Send a POST request to upload the image using AppService
                const responseUpload = await AppService.ServiceUploadImagePost('api/product/upload-img', formData);
                if(responseUpload.statusCode == 200) {
                    console.log(responseUpload.message.data.data)
                    setDataForm({
                        ...dataForm,
                        image: responseUpload.message.data.data
                    })
                    
                    // setIsSuccessCreate({'status':'success', 'message': responseUpload.message.data.data})
                } else {
                    // setIsSuccessCreate({'status':'failed', 'message': responseUpload.errorData.errors})
                }
                console.log('Image uploaded:', responseUpload);
                // Handle responseUpload as needed (e.g., update UI, show success message)
            } catch (error) {
                console.error('Error uploading image:', error);
                // Handle error (e.g., show error message to the user)
            }

            const reader = new FileReader(); // FileReader instance to read file
            reader.onloadend = () => {
                // Set the image preview using reader's result
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file); // Read file as data URL (base64 format)

        } else {
            // Handle no file selected or clear preview
            setImagePreview(null);
        }
    }

    const handleInput = (e) => {
        const {name, value} = e.target
        if (name === 'purchase_price' || name === 'selling_price') {
            setDataForm({
                ...dataForm,
                [name]: FormaterHelper.formatRupiah(value),
            })
        } else {
            setDataForm({
                ...dataForm,
                [name]: value,
            })
        }
    }

    const handleMultiUnit = (e) => {
        const {name, value} = e.target
        setIsMultipleUnit(value === "Y");
        handleSubmit()
    }

    const handleSubmit = async(event) => {
        if (event) {
            event.preventDefault();
        }

        const formData = new FormData(event?.target);
        const purchase_price = dataForm.purchase_price ? dataForm.purchase_price : 0;
        const selling_price = dataForm.selling_price ? dataForm.selling_price : 0;
        const pos = formData.get('pos') === "on" ? "Y" : "N";
        const is_active = formData.get('is_active') === "on" ? "Y" : "N";
        
        try {
            const dataParams = ({
                ...dataForm,
                purchase_price: FormaterHelper.stripRupiahFormatting(purchase_price),
                selling_price: FormaterHelper.stripRupiahFormatting(selling_price),
                pos: pos,
                is_active: is_active,
                username: dataUser.username
            })
            console.log(" === dataParams === ")
            console.log(dataParams)

            let response = null

            if(idProduct == null) {
                response = await AppService.ServicePost('api/product/create', dataParams);
            } else {
                dataParams.id = idProduct
                response = await AppService.ServicePatch('api/product/update', dataParams);
                setIsMultipleUnit(false)
            }
            
            // Send a POST request to upload the image using AppService
            console.log(response)
            if(response.statusCode == 200) {
                console.log(response.message)
                setIdProduct(response.data.id)
                setIsSuccessCreate({'status':'success', 'message': response.message})
            } else {
                if(!isEmpty(response.errorData.error)) {
					setValidationError(response.errorData.error.issues)
				}
                setIsSuccessCreate({'status':'failed', 'message': 'Please check the form input.'})
            }
            console.log('Response Submit data:', response);
            // Handle response as needed (e.g., update UI, show success message)
        } catch (error) {
            console.error('Error Submited data:', error);
            // Handle error (e.g., show error message to the user)
        }
    }

	// Assuming errors is the array of error objects you provided
	const getFormError = (errors, attr) => {
		return errors.some(error => error.path.includes(attr)) 
		? errors.find(error => error.path.includes(attr)).message
		: null;
	};

    const [toast, addToast] = useState(0)
    const toaster = useRef()

    const notifications = isSuccessCreate!=null && (
        <CToast>
            <CToastHeader closeButton>
                {
                    isSuccessCreate.status === 'success' ? 
                    <CIcon icon={cilCheckCircle} style={{marginRight: "5px", color:"green"}} /> 
                    : 
                    <CIcon icon={cilXCircle} style={{marginRight: "5px", color:"red"}} />
                }
                <div className="fw-bold me-auto">
                {isSuccessCreate.status === 'success' ? "Success" : "Failed"}
                </div>
            {/* <small>7 min ago</small> */}
            </CToastHeader>
            <CToastBody>
                <span style={{color:"#2B547E"}}>{isSuccessCreate.message}</span>
            </CToastBody>
        </CToast>
    )
    
    useEffect(() => {
        
        addToast(notifications)
        if(isSuccessCreate?.status == 'success') {
            
            if(isMultipleUnit) {
                const conversionUnitsResponse = async () => {
                    try {
                        const result = await AppService.serviceGet('api/conversion-unit/get-by-product', {product_id: idProduct})
                        setConversionUnitData(result.data);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }
                conversionUnitsResponse()
            }
            
            setTimeout(() => {
                if(!isMultipleUnit) {
                    navigate('/page/master/products')
                }
            }, 3500);
        } else {
            setIsMultipleUnit(false)
        }

    }, [isSuccessCreate]);


    return (
        <div>
            <CRow>
                <CCol className="mb-3">
                    {Language().MENU_NAME_PRODUCT}
                </CCol>
                <CCol md={3} className="mb-3"></CCol>
            </CRow>
            <hr/>
            <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
                <CRow>
                    <CCol md={8}>
                        <CRow>
                            <CCol className='mb-3' md={8}>
                                <CFormInput
                                    type="text"
                                    name="name"
                                    id="name"
                                    label={Language().lang == 'id' ? 'Nama Produk' : 'Product Name'}
                                    onChange={(e) => handleInput(e)}
                                />
                                {getFormError(validationError, 'name') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'name')}
                                    </small>
                                }
                            </CCol>
                            <CCol md={2}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="is_active">Status</CFormLabel>
                                    <CFormCheck 
                                        id="is_active" 
                                        name='is_active' 
                                        label={Language().lang == 'id' ? 'Aktif ?' : 'Active ?'}
                                        defaultChecked/>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="pos">POS</CFormLabel>
                                    <CFormCheck 
                                        id="pos" 
                                        name='pos' 
                                        label={Language().lang == 'id' ? 'Ya ?' : 'Yes ?'}
                                        defaultChecked/>
                                </div>
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormSelect
                                    name="category_id"
                                    id="category_id"
                                    label={Language().LABEL_CATEGORY}
                                    onChange={(e) => handleInput(e)}
                                    required
                                >
                                    <option>Select category</option>
                                    {categoryData && categoryData.map((unit, index) => (
                                        <option key={index} value={unit.id}>{unit.name}</option>
                                    ))}
                                </CFormSelect>
                                {getFormError(validationError, 'category_id') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'category_id')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormSelect
                                    name="brand_id"
                                    id="brand_id"
                                    label={Language().LABEL_BRAND}
                                    onChange={(e) => handleInput(e)}
                                >
                                    <option>Select brand</option>
                                    {brandData && brandData.map((unit, index) => (
                                        <option key={index} value={unit.id}>{unit.name}</option>
                                    ))}
                                </CFormSelect>
                                {getFormError(validationError, 'brand_id') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'brand_id')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormSelect
                                    name="unit_id"
                                    id="unit_id"
                                    label={Language().LABEL_UNIT}
                                    onChange={(e) => handleInput(e)}
                                >
                                    <option>Select unit</option>
                                    {unitData && unitData.map((unit, index) => (
                                        <option key={index} value={unit.id}>{unit.initial}</option>
                                    ))}
                                </CFormSelect>
                                {getFormError(validationError, 'unit_id') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'unit_id')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormInput
                                    type='text'
                                    name="barcode"
                                    id="barcode"
                                    label={'Barcode'}
                                    onChange={(e) => handleInput(e)}
                                />
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormInput
                                    type='number'
                                    name="min_stock"
                                    id="min_stock"
                                    label={'Min '+ Language().LABEL_STOCK}
                                    onChange={(e) => handleInput(e)}
                                />
                                {getFormError(validationError, 'min_stock') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'min_stock')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormInput
                                    type='number'
                                    name="max_stock"
                                    id="max_stock"
                                    label={'Max '+ Language().LABEL_STOCK}
                                    onChange={(e) => handleInput(e)}
                                />
                                {getFormError(validationError, 'max_stock') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'max_stock')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormInput
                                    type='text'
                                    name="purchase_price"
                                    id="purchase_price"
                                    value={dataForm?.purchase_price ?? 0}
                                    label={Language().LABEL_PURCHASE_PRICE}
                                    onChange={(e) => handleInput(e)} onKeyUp={(e) => handleInput(e)}
                                />
                                {getFormError(validationError, 'purchase_price') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'purchase_price')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={6}>
                                <CFormInput
                                    type='text'
                                    name="selling_price"
                                    id="selling_price"
                                    value={dataForm?.selling_price ?? 0}
                                    label={Language().LABEL_SELLING_PRICE}
                                    onChange={(e) => handleInput(e)} onKeyUp={(e) => handleInput(e)}
                                />
                                {getFormError(validationError, 'selling_price') != null &&
                                    <small className='ms-1' style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                                    {getFormError(validationError, 'selling_price')}
                                    </small>
                                }
                            </CCol>
                            <CCol className='mb-3' md={12}>
                                <CFormInput
                                    type='text'
                                    name="description"
                                    id="description"
                                    label={Language().LABEL_DESC}
                                    onChange={(e) => handleInput(e)}
                                />
                            </CCol>

                            <ConversionTable conversionUnitData={conversionUnitData} unitData={unitData} idProduct={idProduct} setIsMultipleUnit={setIsMultipleUnit} setIsSuccessCreate={setIsSuccessCreate}/>
                        </CRow>
                    </CCol>
                        
                    <CCol md={4}>
                        <CRow>

                            <CCol md={12}>
                                <label className='mb-2'>{Language().LABEL_IMAGE}</label>
                                {/* <div id='preview-img' style={{height: '300px', background: '#eaeaea'}}> */}
                                <div id='preview-img' style={{ 
                                    height: '300px', 
                                    background: '#fafafa',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ 
                                            maxWidth: 'auto', 
                                            height: '97%', 
                                            objectFit: 'contain' 
                                        }} />
                                    ) : (
                                        <p style={{padding: '10px', color: '#acacac'}}>No image selected</p>
                                    )}
                                </div>
                                <CFormInput 
                                    className='mt-3'
                                    type='file'
                                    name='image'
                                    accept="image/*"
                                    onChange={(e) => handleInputImage(e)}
                                />
                            </CCol>
                            
                            <CCol md={5}>
                                <label className='mb-2 mt-4 pt-3'>{Language().lang == 'id' ? 'Tambah Multi Satuan' : 'Add Multiple Unit'}</label>
                            </CCol>
                            <CCol md={5} className='pt-2'>
                                <CFormSelect name='multiple_unit' className='mb-2 mt-4' value={isMultipleUnit ? 'Y' : 'N'} onChange={handleMultiUnit} disabled={isMultipleUnit == 'Y'}>
                                    <option value={'Y'}> {Language().lang == 'id' ? 'Ya' : 'Yes'} </option>
                                    <option value={'N'}> {Language().lang == 'id' ? 'Tidak' : 'No'} </option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        
                    </CCol>
                </CRow>

                <CCol xs={12}>
                    <CButton color="primary" type="submit">
                        Submit form
                    </CButton>
                </CCol>
            </CForm>

            <br />

            {/* Assuming these are components rendered conditionally based on `action` */}
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>
    );
    
};

export default AddDataProduct;
