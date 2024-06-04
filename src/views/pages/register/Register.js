import React, { useState } from 'react'
import axios from 'axios' // Import Axios library
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilPhone, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

const Register = () => {
	const navigate = useNavigate()
	
	const [flashSuccess, setFlashSuccess] = useState('')
	const [flashError, setFlashError] = useState('')
	const [validationError, setValidationError] = useState([])
	const [errorPasswordVerify, setErrorPasswordVerify] = useState('')
	const [isSamePassword, setIsSamePassword] = useState(false)
	
	const BASE_URL = 'http://127.0.0.1:3001/'
	
	const handleSubmit = async (event) => {
		event.preventDefault()
		// Extract form data
		const formData = new FormData(event.target)
		const name = (formData.get('fullname') || "").trim(); // Trim whitespace and handle null value
		const username = formData.get('username');
		const gender = (formData.get('gender') || "").trim(); // Trim whitespace and handle null value
		const phone = (formData.get('phone') || "").trim(); // Trim whitespace and handle null value
		const email = formData.get('email');
		const password = formData.get('password').trim();
		const password1 = formData.get('password1').trim();

		if(password) {
			if(password == password1) {
				setIsSamePassword(true)
				setErrorPasswordVerify("Password does not matches")
			}
		}

		const userData = {
			username: username,
			email: email,
			password: password,
			is_active: "Y",
		};

		setValidationError([])
		setErrorPasswordVerify('')
		
		if (name) {
			userData.name = name;
		} else {
			setValidationError(
				[
					{
						"code": "too_small",
						"minimum": 1,
						"type": "string",
						"inclusive": true,
						"exact": false,
						"message": "Please enter your name",
						"path": [
							"name"
						]
					},
				]
			)
			console.log(validationError)
		}
		
		if(!username) {
			setValidationError(prevErrors => [
					...prevErrors,	
					{
						"code": "too_small",
						"minimum": 1,
						"type": "string",
						"inclusive": true,
						"exact": false,
						"message": "Please enter your username",
						"path": [
							"username"
						]
					},
				]
			)
			console.log(validationError)
		}
		if(gender) {
			userData.gender = gender;
		} else {
			setValidationError(prevErrors => [
					...prevErrors,	
					{
						"code": "too_small",
						"minimum": 1,
						"type": "string",
						"inclusive": true,
						"exact": false,
						"message": "Please select your gender",
						"path": [
							"gender"
						]
					},
				]
			)
			console.log(validationError)
		}
		
		if (phone) {
			userData.phone = phone;
		} else {
			if(!phone) {
				setValidationError(prevErrors => [
						...prevErrors,	
						{
							"code": "too_small",
							"minimum": 1,
							"type": "string",
							"inclusive": true,
							"exact": false,
							"message": "Please enter your phone",
							"path": [
								"phone"
							]
						},
					]
				)
				console.log(validationError)
			}
		}
		
		if(!email) {
			setValidationError(prevErrors => [
					...prevErrors,	
					{
						"code": "too_small",
						"minimum": 1,
						"type": "string",
						"inclusive": true,
						"exact": false,
						"message": "Please enter your email",
						"path": [
							"email"
						]
					},
				]
			)
			console.log(validationError)
		}
		
		if(!password) {
			setValidationError(prevErrors => [
					...prevErrors,	
					{
						"code": "too_small",
						"minimum": 1,
						"type": "string",
						"inclusive": true,
						"exact": false,
						"message": "Please enter your password",
						"path": [
							"password"
						]
					},
				]
			)
			console.log(validationError)
		}
		if(!password1) {
			setErrorPasswordVerify("Please enter password again")
		}

		setFlashSuccess('')
		setFlashError('')
		if(isSamePassword) {
			try {
				// Send form data to server using Axios
				const response = await axios.post(BASE_URL + 'api/user/create', userData)
				console.log(response.data.data) // Handle successful response
				
				setFlashSuccess("Congratulation, registration successfully.")
				setTimeout(() => {
					navigate('/login')
				}, 3500);
				// Optionally, you can redirect the user to a new page upon successful registration
			} catch (error) {
				console.log(error.response.data.errors)
				setFlashError(error.response.data.errors)
				
				if(!isEmpty(error.response.data.error.issues)) {
					setValidationError(error.response.data.error.issues)
				}
				console.error('Registration failed:', error.response.data.error.issues) // Handle error response
			}
		}

	}

	console.log(validationError)
	// Assuming errors is the array of error objects you provided
	const getFullnameErrors = (errors) => {
		return errors.some(error => error.path.includes('name')) 
		? errors.find(error => error.path.includes('name')).message
		: null;
	};
	
	const fullnameError = getFullnameErrors(validationError);
	console.log(fullnameError); // This will log "Required" if a fullname error is found, otherwise null
	
	const getUsernameFromErrors = (errors) => {
		return errors.some(error => error.path.includes('username')) 
		? errors.find(error => error.path.includes('username')).message
		: null;
	};
	
	const usernameError = getUsernameFromErrors(validationError);
	console.log(usernameError); // This will log "Required" if a username error is found, otherwise null

	const getGenderFromErrors = (errors) => {
		return errors.some(error => error.path.includes('gender')) 
		? errors.find(error => error.path.includes('gender')).message
		: null;
	};
	
	const genderError = getGenderFromErrors(validationError);
	console.log(genderError); // This will log "Required" if a gender error is found, otherwise null

	const getEmailFromErrors = (errors) => {
		return errors.some(error => error.path.includes('email')) 
		? errors.find(error => error.path.includes('email')).message
		: null;
	};
	
	const getPhoneFromErrors = (errors) => {
		return errors.some(error => error.path.includes('phone')) 
		? errors.find(error => error.path.includes('phone')).message
		: null;
	};
	
	const phoneError = getPhoneFromErrors(validationError);
	console.log(phoneError); // This will log "Required" if a username error is found, otherwise null
	
	const emailError = getEmailFromErrors(validationError);
	console.log(emailError); // This will log "Required" if a username error is found, otherwise null

	const getPasswordFromErrors = (errors) => {
		return errors.some(error => error.path.includes('password')) 
		? errors.find(error => error.path.includes('password')).message
		: null;
	};
	
	let passwordError = ''
	let passwordError1 = ''
	console.log("============errorPasswordVerify=============")
	// console.log(errorPasswordVerify)
	console.log(getPasswordFromErrors(validationError))
	if(getPasswordFromErrors(validationError) == null && errorPasswordVerify) {
		passwordError1 = errorPasswordVerify;
	} else {
		passwordError = getPasswordFromErrors(validationError);
	}
	
	return (
		<div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
		<CContainer>
			<CRow className="justify-content-center">
			<CCol md={9} lg={7} xl={6}>
				<CCard className="mx-4">
				<CCardBody className="p-4">
					<CForm onSubmit={handleSubmit}>
					<h1>Register</h1>
					{flashSuccess != '' && 
						<p className="alert alert-success py-2">{flashSuccess}</p>
					}
					{flashError != '' && 
						<p className="alert alert-danger py-2">{flashError}</p>
					}
					<p className="text-body-secondary">Create your account</p>
					<CInputGroup className="mb-3">
						<CInputGroupText>
						<CIcon icon={cilUser} />
						</CInputGroupText>
						<CFormInput name="fullname" placeholder="Fullname" autoComplete="fullname" />
						{fullnameError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{fullnameError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-3">
						<CInputGroupText>
						<CIcon icon={cilUser} />
						</CInputGroupText>
						<CFormInput name="username" placeholder="Username" autoComplete="username" />
						{usernameError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{usernameError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-3">
						<CInputGroupText>
						<CIcon icon={cilUser} />
						</CInputGroupText>
						<CFormSelect name="gender" placeholder="Select gender" autoComplete="off">
							<option value={""}>Select gender</option>
							<option value={"M"}>Male</option>
							<option value={"F"}>Female</option>
						</CFormSelect>
						{genderError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{genderError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-3">
						<CInputGroupText>
						<CIcon icon={cilPhone} />
						</CInputGroupText>
						<CFormInput name="phone" placeholder="Phone" autoComplete="phone" />
						{phoneError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{phoneError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-3">
						<CInputGroupText>@</CInputGroupText>
						<CFormInput name="email" placeholder="Email" autoComplete="email" />
						{emailError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{emailError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-3">
						<CInputGroupText>
						<CIcon icon={cilLockLocked} />
						</CInputGroupText>
						<CFormInput
						type="password"
						name="password"
						placeholder="Password"
						autoComplete="new-password"
						/>
						{passwordError != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{passwordError}
							</small>
						}
					</CInputGroup>
					<CInputGroup className="mb-4">
						<CInputGroupText>
						<CIcon icon={cilLockLocked} />
						</CInputGroupText>
						<CFormInput
						type="password"
						name="password1"
						placeholder="Repeat password"
						autoComplete="new-password"
						/>
						{passwordError1 != null &&
							<small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
							{passwordError1}
							</small>
						}
					</CInputGroup>
					<div className="d-grid">
						<CButton type="submit" color="success">Create Account</CButton>
					</div>
					</CForm>
				</CCardBody>
				</CCard>
			</CCol>
			</CRow>
		</CContainer>
		</div>
	)
}

export default Register
