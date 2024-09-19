// pages/_app.js

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { initializeUser } from '../redux/slices/userSlice';
import '../styles/globals.css';
import Layout from '@/components/Layout';
import '@flaticon/flaticon-uicons/css/all/all.css';

const MyApp = ({ Component, pageProps, router }) => {
  useEffect(() => {
    store.dispatch(initializeUser());
  }, []);

  // Define pages that do not require the default Layout (navbar and footer)
  const noLayoutPages = ['/admin', '/admin/manage-business', '/admin/manage-team-members', '/admin/manage-appointments', '/customer', '/customer/booking', '/customer/appointments', '/team/availability' , '/team' , '/team/business-details', '/team/manage-appointments'];

  // Check if the current route matches any of the noLayoutPages
  const isNoLayoutPage = noLayoutPages.includes(router.pathname);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Use Layout for pages that are not admin pages */}
        {isNoLayoutPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
