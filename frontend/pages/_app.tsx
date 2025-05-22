import '../styles/globals.css';
import React from 'react';
import type { AppProps } from "next/app";
import '../styles/style.css';
import '../styles/gridComponent.css';

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
}

export default App;