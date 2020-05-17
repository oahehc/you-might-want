import React from 'react';
import Head from 'next/head';
import App from 'next/app';
import { GlobalModalProvider } from '@contexts/GlobalModal';
import { PostsProvider } from '@contexts/Posts';
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
        </Head>
        <style global jsx>
          {resetStyle}
        </style>
        <style global jsx>
          {globalStyle}
        </style>
        <GlobalModalProvider>
          <PostsProvider>
            <Component {...pageProps} />
          </PostsProvider>
        </GlobalModalProvider>
      </>
    );
  }
}
