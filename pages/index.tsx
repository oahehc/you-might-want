import Head from 'next/head';
import express from 'express';
import etag from 'etag';
import { Account, CreatePost, PostList } from '@components/index';
import { getProbabilisticSharing } from '@utils/apis';

const IndexPage = ({ paymentPoint }: { paymentPoint: string }) => {
  return (
    <>
      <Head>
        <meta name="monetization" content={paymentPoint} />
      </Head>
      <Account />
      <CreatePost />
      <PostList />
    </>
  );
};

export default IndexPage;

export const getServerSideProps = async ({ res }: { res: express.Response }) => {
  let paymentPoint = process.env.default_wallet;

  if (res) {
    try {
      const { data } = await getProbabilisticSharing();
      paymentPoint = selectByProbabilistic(data);
      res.setHeader('Cache-Control', 'private,max-age=0,must-revalidate');
      res.setHeader('ETag', etag(paymentPoint, { weak: true }));
    } catch (error) {
      console.error('get sharing fail');
    }
  }

  return {
    props: {
      paymentPoint,
    },
  };
};

function selectByProbabilistic(map: { [wallet: string]: number }): string {
  let random = Math.random();

  for (const pointer in map) {
    const weight = map[pointer];
    if ((random -= weight) <= 0) return pointer;
  }

  return Object.keys(map)[0];
}
