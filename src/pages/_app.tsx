import type { AppProps /*, AppContext */ } from 'next/app';
import Axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/auth';
import { SWRConfig } from 'swr';

import '../styles/tailwind.css';
import '../styles/icons.css';
import axios from 'axios';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        throw err.response.data;
    }
};

function MyApp({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();
    // const authRoutes = pathname === '/login' || pathname === '/register'
    const authRoutes = ['/login', '/register'];
    const authRoute = authRoutes.includes(pathname);
    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 10000
            }}
        >
            <AuthProvider>
                {!authRoute && <Navbar />}
                <div className={authRoute ? '' : 'pt-12'}>
                    <Component {...pageProps} />
                </div>
            </AuthProvider>
        </SWRConfig>
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
