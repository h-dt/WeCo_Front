import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { setAuthToken } from 'services/BaseService';
import { useEffect } from 'react';
import { tempAuthLogin } from 'services/LoginService';
import { setCookie, isCookieExist } from 'utils/common';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  useEffect(() => {
    const isCookie = isCookieExist('accessToken');
    if (!isCookie) {
      tempLogin();
    } else {
    }
  }, []);

  const tempLogin = async () => {
    const response = await tempAuthLogin();
    if (response.data.accessToken) {
      const accessToken = response.data.accessToken;

      const expires = new Date();
      expires.setDate(Date.now() + 1000 * 60 * 60 * 24); //24시간

      setAuthToken(accessToken); //header
      setCookie('accessToken', accessToken, {
        path: '/',
        expires,
      }); //cookie
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
