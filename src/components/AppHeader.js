import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilFlagAlt,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import Language from '../utils/language'
import AppService from '../services/AppService'
import { setSidebarShow } from '../redux/actions/sidebarActions'

const AppHeader = ({userData}) => {

  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const [currentLanguage, setCurrentLanguage] = useState('id')
  const [currentBranch, setCurrentBranch] = useState('id')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [allBranchData, setAllBranchData] = useState(null)

  useEffect(() => {
    const getDataBranch = async () => {
			try {
				const result = await AppService.serviceGet('api/all-branch')
				setAllBranchData(result.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		getDataBranch()
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
    const currentLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'id';
    setCurrentLanguage(currentLang)
    const currentBranch = localStorage.getItem('currentBranch') ? localStorage.getItem('currentBranch') : '1';
    setCurrentBranch(currentBranch)
  }, [])

  const handleChangeLanguage = (e) => {
    localStorage.setItem('lang', e.target.value)
    window.location.reload()
  }
  const handleChangeBranch = (e) => {
    localStorage.setItem('currentBranch', e.target.value)
    window.location.reload()
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch(setSidebarShow(!sidebarShow))}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <div className='pt-1 me-2'>
              {Language().LABEL_BRANCH}
            </div>
          </CNavItem> 
          <CNavItem className='me-3'>
            <CFormSelect name='currentBranch' id='currentBranch' value={currentBranch} onChange={handleChangeBranch}>
              <option value={''}>Select branch</option>
              {allBranchData != null &&
                allBranchData.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                  )
                )
              }
            </CFormSelect>
          </CNavItem> 
          <CNavItem>
            <div className='pt-1 me-2'>
              {/* {Language().LABEL_LANG} */}
              <CIcon icon={cilFlagAlt} />
            </div>
          </CNavItem> 
          <CNavItem>
            <CFormSelect name='lang' id='lang' value={currentLanguage} onChange={handleChangeLanguage}>
              <option value="id">ID</option>
              <option value="en">EN</option>
            </CFormSelect>
          </CNavItem> 
          {/* <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <div>
          {/* {userData && userData.name} */}
          </div>
          {userData && <AppHeaderDropdown userData={userData}  />}
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb/>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
