import React, { RefObject } from 'react';
import styles from './LoadingWrapper.style';
import { Loading } from './Loading';

type Props = {
  innerRef?: RefObject<HTMLDivElement>;
  isLoading: boolean;
};

const LoadingWrapper: React.FC<Props> = ({ isLoading, innerRef }) => {
  return (
    <div ref={innerRef} className="wrapper">
      {isLoading && <Loading />}
      <style jsx>{styles}</style>
    </div>
  );
};

export { LoadingWrapper };
