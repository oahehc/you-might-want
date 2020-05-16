import React from 'react';
import Head from 'next/head';
import App from 'next/app';
import { GlobalModalProvider } from '@contexts/GlobalModal';
import globalStyle from '@styles/global.style';
import resetStyle from '@styles/reset.style';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>You Might Want...</title>
          <link rel="shortcut icon" href="/static/favicon.svg"></link>
          <meta name="monetization" content="$coil.xrptipbot.com/3c513f24-3afe-452b-a85d-726e93bfd8ea" />
        </Head>
        <style global jsx>
          {resetStyle}
        </style>
        <style global jsx>
          {globalStyle}
        </style>
        <GlobalModalProvider>
          <Component {...pageProps} />
        </GlobalModalProvider>
      </>
    );
  }
}
