import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow, CToast, CToastBody, CToastHeader, CToaster } from "@coreui/react";
import Language from "../../../../utils/language";
import CIcon from "@coreui/icons-react";
import AppService from "../../../../services/AppService";
import { cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';

const AddDataProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [dataForm, setDataForm] = useState({});
    const [detailProduct, setDetailProduct] = useState(null);
    const [unitData, setUnitData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSuccessCreate, setIsSuccessCreate] = useState(null);
    const [barcode, setBarcode] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productResponse, categoryResponse, brandResponse, unitResponse] = await Promise.all([
                    AppService.serviceGet('api/product/get', { id }),
                    AppService.serviceGet('api/all-category'),
                    AppService.serviceGet('api/all-brand'),
                    AppService.serviceGet('api/all-unit'),
                ]);

                if (productResponse.data) {
                    setDetailProduct(productResponse.data);
                    setImagePreview(productResponse.data.image);
                }
                setCategoryData(categoryResponse.data);
                setBrandData(brandResponse.data);
                setUnitData(unitResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, [id]);

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
        setDetailProduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const is_active = formData.get('is_active') === "on" ? "Y" : "N";

        const paramsDataUpdate = {
            id: id,
            name: detailProduct.name,
            category_id: detailProduct.category_id,
            brand_id: detailProduct.brand_id,
            unit_id: detailProduct.unit_id,
            min_stock: detailProduct.min_stock,
            max_stock: detailProduct.max_stock,
            purchase_price: detailProduct.purchase_price,
            selling_price: detailProduct.selling_price,
            image: dataForm.image,  // Ensure image is included
            is_active: is_active,
            username: localStorage.getItem('username'),
        };

        if(detailProduct.description) {
            paramsDataUpdate.description = detailProduct.description
        }

        console.log("paramsDataUpdate")
        console.log(paramsDataUpdate)

        try {
            const response = await AppService.ServicePatch('api/product/update', paramsDataUpdate);
            if (response.statusCode === 200) {
                setIsSuccessCreate({ status: 'success', message: response.message.data });
            } else {
                setIsSuccessCreate({ status: 'failed', message: response.errorData.errors });
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
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
        if (isSuccessCreate) {
            addToast(notifications);

            if (isSuccessCreate.status === 'success') {
                setTimeout(() => {
                    navigate('/page/master/products');
                }, 3000);
            }
        }
    }, [isSuccessCreate, navigate]);

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
                                <CCol className='mb-3' md={9}>
                                    <CFormInput
                                        type="text"
                                        name="name"
                                        id="name"
                                        label={Language().lang === 'id' ? 'Nama Produk' : 'Product Name'}
                                        onChange={handleInput}
                                        value={detailProduct.name}
                                        required
                                    />
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="is_active">Status</CFormLabel>
                                        <CFormCheck
                                            id="is_active"
                                            name='is_active'
                                            label={Language().lang === 'id' ? 'Aktif ?' : 'Active ?'}
                                            defaultChecked={detailProduct.is_active === "Y"} />
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
                                        label={'Min Stock'}
                                        onChange={handleInput}
                                        value={detailProduct.min_stock}
                                    />
                                </CCol>
                                <CCol className='mb-3' md={6}>
                                    <CFormInput
                                        type='number'
                                        name="max_stock"
                                        id="max_stock"
                                        label={'Max Stock'}
                                        onChange={handleInput}
                                        value={detailProduct.max_stock}
                                    />
                                </CCol>
                                <CCol className='mb-3' md={6}>
                                    <CFormInput
                                        type='text'
                                        name="purchase_price"
                                        id="purchase_price"
                                        label={'Purchase Price'}
                                        onChange={handleInput}
                                        value={detailProduct.purchase_price}
                                    />
                                </CCol>
                                <CCol className='mb-3' md={6}>
                                    <CFormInput
                                        type='text'
                                        name="selling_price"
                                        id="selling_price"
                                        label={'Selling Price'}
                                        onChange={handleInput}
                                        value={detailProduct.selling_price}
                                    />
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
                            </CRow>
                        </CCol>
                        <CCol md={4}>
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
