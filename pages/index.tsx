import Head from 'next/head';
import useMonetization from '@hooks/useMonetization';

const IndexPage = () => {
  const [info] = useMonetization();
  console.log('info', info);

  return (
    <>
      <Head>
        <meta name="monetization" content="$coil.xrptipbot.com/3c513f24-3afe-452b-a85d-726e93bfd8ea" />
      </Head>
      <div>
        <h1>Hello Next.js 👋</h1>
      </div>
    </>
  );
};

export default IndexPage;
