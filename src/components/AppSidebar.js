import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { setSidebarShow } from '../redux/actions/sidebarActions'

const AppSidebar = () => {
	const dispatch = useDispatch()
	const unfoldable = useSelector((state) => state.sidebarUnfoldable)
	const sidebarShow = useSelector((state) => state.sidebarShow)
	
	return (
		<CSidebar
			className="border-end"
			colorScheme="light"
			position="fixed"
			unfoldable={unfoldable}
			visible={sidebarShow}
			onVisibleChange={(visible) => {
				dispatch(setSidebarShow(visible)); // Dispatch action to update sidebarShow
			}}
			>
			<CSidebarHeader className="border-bottom">
				<CSidebarBrand to="/" style={{ textDecoration: 'none' }}>
				{/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
				<div className="mx-4" style={{ fontSize: '28px' }}>
					<strong>P O S</strong> <sup>29erp</sup>
				</div>
				<CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
				</CSidebarBrand>
				<CCloseButton
				className="d-lg-none"
				dark
				onClick={() => dispatch({ type: 'set', sidebarShow: false })}
				/>
			</CSidebarHeader>
			<AppSidebarNav items={navigation} />
			<CSidebarFooter className="border-top d-none d-lg-flex">
				<CSidebarToggler
				onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
				/>
			</CSidebarFooter>
		</CSidebar>
	)
}

export default React.memo(AppSidebar)
