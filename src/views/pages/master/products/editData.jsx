import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastHeader, CToaster } from "@coreui/react";
import Language from "../../../../utils/language";
import CIcon from "@coreui/icons-react";
import AppService from "../../../../services/AppService";
import { cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import FormaterHelper from '../../../../utils/fotmaterHelper';
import ConversionTable from './conversion_unit/conversionUnitTable';
import { useSelector } from 'react-redux';

const AddDataProduct = () => {
    const dataUser = useSelector((state) => state.dataUser);
    const navigate = useNavigate();
    const { id } = useParams();
    const idProduct = id

    const [dataForm, setDataForm] = useState({});
    const [detailProduct, setDetailProduct] = useState(null);
    const [unitData, setUnitData] = useState([]);
    const [conversionUnitData, setConversionUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSuccessCreate, setIsSuccessCreate] = useState(null);
    const [validationError, setValidationError] = useState([])
    const [barcode, setBarcode] = useState('');
    const [isMultipleUnit, setIsMultipleUnit] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productResponse, categoryResponse, brandResponse, unitResponse, conversionUnitsResponse] = await Promise.all([
                    AppService.serviceGet('api/product/get', { id }),
                    AppService.serviceGet('api/all-category'),
                    AppService.serviceGet('api/all-brand'),
                    AppService.serviceGet('api/all-unit'),
                    AppService.serviceGet('api/conversion-unit/get-by-product', {product_id:idProduct}),
                ]);

                if (productResponse.data) {
                    setDetailProduct(productResponse.data);
                    setImagePreview(productResponse.data.image);
                }
                setCategoryData(categoryResponse.data);
                setBrandData(brandResponse.data);
                setUnitData(unitResponse.data);
                if(conversionUnitsResponse.data.length > 0) {
                    setIsMultipleUnit('Y')
                }
                setConversionUnitData(conversionUnitsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [idProduct]);

    const handleInputImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await AppService.ServiceUploadImagePost('api/product/upload-img', formData);
                if (response.statusCode === 200) {
                    const imageUrl = response.message.data.data;
                    setDataForm((prevData) => ({
                        ...prevData,
                        image: imageUrl,
                    }));
                } else {
                    setIsSuccessCreate({ status: 'failed', message: response.errorData.errors });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === 'purchase_price' || name === 'selling_price') {
            setDetailProduct((prevData) => ({
                ...prevData,
                [name]: FormaterHelper.formatRupiah(value),
            }));
        } else {
            setDetailProduct((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleMultiUnit = (e) => {
        const {name, value} = e.target
        setIsMultipleUnit(value === "Y");
        handleSubmit()
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const is_active = formData.get('is_active') === "on" ? "Y" : "N";
        const pos = formData.get('pos') === "on" ? "Y" : "N";

        const paramsDataUpdate = {
            id: idProduct,
            name: detailProduct.name,
            category_id: detailProduct.category_id,
            brand_id: detailProduct.brand_id,
            unit_id: detailProduct.unit_id,
            min_stock: detailProduct.min_stock,
            max_stock: detailProduct.max_stock,
            purchase_price: FormaterHelper.stripRupiahFormatting(detailProduct.purchase_price),
            selling_price: FormaterHelper.stripRupiahFormatting(detailProduct.selling_price),
            image: dataForm.image,  // Ensure image is included
            is_active: is_active,
            pos: pos,
            username: dataUser.username
        };

        if(detailProduct.description) {
            paramsDataUpdate.description = detailProduct.description
        }

        console.log("paramsDataUpdate")
        console.log(paramsDataUpdate)

        try {
            const response = await AppService.ServicePatch('api/product/update', paramsDataUpdate);
            console.log(response)
            if (response.statusCode === 200) {
                setIsSuccessCreate({ status: 'success', message: response.message });
            } else {
                if(!isEmpty(response.errorData.error)) {
					setValidationError(response.errorData.error.issues)
				}
                setIsSuccessCreate({'status':'failed', 'message': 'Please check the form input.'})
                // setIsSuccessCreate({ status: 'failed', message: response.errorData.errors });
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    
    // Assuming errors is the array of error objects you provided
    const getFormError = (errors, attr) => {
        return errors.some(error => error.path.includes(attr)) 
        ? errors.find(error => error.path.includes(attr)).message
        : null;
    };

    const [toast, addToast] = useState(0);
    const toaster = useRef();

    const notifications = isSuccessCreate != null && (
        <CToast>
            <CToastHeader closeButton>
                {
                    isSuccessCreate.status === 'success' ?
                        <CIcon icon={cilCheckCircle} style={{ marginRight: "5px", color: "green" }} />
                        :
                        <CIcon icon={cilXCircle} style={{ marginRight: "5px", color: "red" }} />
                }
                <div className="fw-bold me-auto">
                    {isSuccessCreate.status === 'success' ? "Success" : "Failed"}
                </div>
            </CToastHeader>
            <CToastBody>
                <span style={{ color: "#2B547E" }}>{isSuccessCreate.message}</span>
            </CToastBody>
        </CToast>
    );

    useEffect(() => {
        addToast(notifications);
        if (isSuccessCreate?.status == 'success') {
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
            <hr />
            {detailProduct != null &&
                <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
                    <CRow>
                        <CCol md={8}>
                            <CRow>
                                <CCol className='mb-3' md={8}>
                                    <CFormInput
                                        type="text"
                                        name="name"
                                        id="name"
                                        label={Language().lang === 'id' ? 'Nama Produk' : 'Product Name'}
                                        onChange={handleInput}
                                        value={detailProduct.name}
                                        required
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
                                            label={Language().lang === 'id' ? 'Aktif ?' : 'Active ?'}
                                            defaultChecked={detailProduct.is_active === "Y"} />
                                    </div>
                                </CCol>
                                <CCol md={2}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="pos">POS</CFormLabel>
                                        <CFormCheck
                                            id="pos"
                                            name='pos'
                                            label={Language().lang === 'id' ? 'Ya ?' : 'Yes ?'}
                                            defaultChecked={detailProduct.pos === "Y"} />
                                    </div>
                                </CCol>
                                <CCol className='mb-3' md={6}>
                                    <CFormSelect
                                        name="category_id"
                                        id="category_id"
                                        label={Language().LABEL_CATEGORY}
                                        defaultValue={detailProduct.category_id}
                                        onChange={handleInput}
                                    >
                                        <option>Select category</option>
                                        {categoryData && categoryData.map((category, index) => (
                                            <option key={index} value={category.id}>{category.name}</option>
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
                                        defaultValue={detailProduct.brand_id}
                                        onChange={handleInput}
                                    >
                                        <option>Select brand</option>
                                        {brandData && brandData.map((brand, index) => (
                                            <option key={index} value={brand.id}>{brand.name}</option>
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
                                        defaultValue={detailProduct.unit_id}
                                        onChange={handleInput}
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
                                        onChange={handleInput}
                                        value={detailProduct.barcode ?? ''}
                                    />
                                </CCol>
                                <CCol className='mb-3' md={6}>
                                    <CFormInput
                                        type='number'
                                        name="min_stock"
                                        id="min_stock"
                                        label={'Min '+ Language().LABEL_STOCK}
                                        onChange={handleInput}
                                        value={detailProduct.min_stock}
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
                                        onChange={handleInput}
                                        value={detailProduct.max_stock}
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
                                        label={Language().LABEL_PURCHASE_PRICE}
                                        value={FormaterHelper.formatRupiah(detailProduct.purchase_price.toString())}
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
                                        label={Language().LABEL_SELLING_PRICE}
                                        value={FormaterHelper.formatRupiah(detailProduct.selling_price.toString())}
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
                                        onChange={handleInput}
                                        value={detailProduct.description ?? ''}
                                    />
                                </CCol>

                                <ConversionTable conversionUnitData={conversionUnitData} unitData={unitData} idProduct={idProduct} setIsMultipleUnit={setIsMultipleUnit} setIsSuccessCreate={setIsSuccessCreate}/>
                                
                            </CRow>
                        </CCol>

                        <CCol md={4}>
                            <CRow>
                                <CCol md={12}>
                                    <label className='mb-2'>{Language().LABEL_IMAGE}</label>
                                    <div id='preview-img' style={{
                                        height: '300px',
                                        background: '#fafafa',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {imagePreview ? (
                                            <img src={`http://127.0.0.1:3001${imagePreview}`} alt="Preview" style={{
                                                maxWidth: 'auto',
                                                height: '97%',
                                                objectFit: 'contain'
                                            }} />
                                        ) : (
                                            <p style={{ padding: '10px', color: '#acacac' }}>No image selected</p>
                                        )}
                                    </div>
                                    <CFormInput
                                        className='mt-3'
                                        type='file'
                                        name='image'
                                        accept="image/*"
                                        onChange={handleInputImage}
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
            }

            <br />

            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </div>
    );
};

export default AddDataProduct;
