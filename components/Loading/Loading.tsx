import React from 'react';
import styles from './Loading.style';

type Props = {
  height?: string;
  width?: string;
};

const Loading = ({ height, width }: Props) => {
  const customStyle = {
    height: '100%',
    width: '100%',
  };

  if (height) customStyle.height = height;
  if (width) customStyle.width = width;

  return (
    <div style={customStyle} className="loading__wrapper">
      <div className="loading__dots" />
      <style jsx>{styles}</style>
    </div>
  );
};

export { Loading };
