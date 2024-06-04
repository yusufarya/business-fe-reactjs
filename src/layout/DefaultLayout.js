import React from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useSelector } from 'react-redux';

const DefaultLayout = () => {
	const dataUser = useSelector((state) => state.dataUser);
	
	return (
		<div>
			{dataUser && <AppSidebar />}
			<div className="wrapper d-flex flex-column min-vh-100">
				{dataUser && <AppHeader userData={dataUser} />}
				<div className="body flex-grow-1">
					{/* Render AppContent with user data if available */}
					<AppContent/>
					</div>
				<AppFooter />
			</div>
			
		</div>
	);
};

export default DefaultLayout;
