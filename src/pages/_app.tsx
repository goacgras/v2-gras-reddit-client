import type { AppProps /*, AppContext */ } from 'next/app';
import Axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

import '../styles/tailwind.css';
import '../styles/icons.css';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();
    // const authRoutes = pathname === '/login' || pathname === '/register'
    const authRoutes = ['/login', '/register'];
    const authRoute = authRoutes.includes(pathname);
    return (
        <>
            {!authRoute && <Navbar />}
            <Component {...pageProps} />
        </>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
