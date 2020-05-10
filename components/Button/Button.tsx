import React from 'react';
import cx from 'classnames';
import styles from './Button.style';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  invert?: boolean;
  style?: any;
};

const Button: React.FC<Props> = ({ children, invert, ...rest }) => (
  <button className={cx({ invert })} {...rest}>
    {children}
    <style jsx>{styles}</style>
  </button>
);

export { Button };
