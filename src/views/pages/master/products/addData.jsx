import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow, CToast, CToastBody, CToastHeader, CToaster} from "@coreui/react";
import Language from "../../../../utils/language";
import CIcon from "@coreui/icons-react";
import AppService from "../../../../services/AppService";
import { cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

const AddDataProduct = () => {
    const navigate = useNavigate()

    const [dataForm, setDataForm] = useState(null)
    const [unitData, setUnitData] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const [brandData, setBrandData] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [isSuccessCreate, setIsSuccessCreate] = useState(null)
    const [validationError, setValidationError] = useState([])
    
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
        setDataForm({
            ...dataForm,
            [name]: value
        })
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        const formData = new FormData(event.target)
        
		const pos = formData.get('pos') == "on" ? "Y" : "N";
		const is_active = formData.get('is_active') == "on" ? "Y" : "N";
        try {
            const dataParams = ({
                ...dataForm,
                pos: pos,
                is_active: is_active,
                username: localStorage.getItem('username')
            })
            console.log(" === dataParams === ")
            console.log(dataParams)
            
            // Send a POST request to upload the image using AppService
            const response = await AppService.ServicePost('api/product/create', dataParams);
            if(response.statusCode == 200) {
                console.log(response.message)
                setIsSuccessCreate({'status':'success', 'message': response.message.data})
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

    // console.log("=== isSuccessCreate ===")
    // console.log(isSuccessCreate)

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
        if(isSuccessCreate) {
            addToast(notifications)
            setTimeout(() => {
                navigate('/page/master/products')
            }, 3500);
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
                                    label={'Min Stock'}
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
                                    label={'Max Stock'}
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
                                    label={'Purchase Price'}
                                    onChange={(e) => handleInput(e)}
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
                                    label={'Selling Price'}
                                    onChange={(e) => handleInput(e)}
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
                        </CRow>
                        
                    </CCol>
                    <CCol md={4}>
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
