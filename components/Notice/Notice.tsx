import React from 'react';
import { MdMood, MdInfo, MdCancel, MdWarning } from 'react-icons/md';
import styles from './Notice.style';

type Props = {
  type: 'success' | 'info' | 'warning' | 'error';
};

const IconMap = {
  success: MdMood,
  info: MdInfo,
  warning: MdWarning,
  error: MdCancel,
};

const Notice: React.FC<Props> = ({ type, children }) => {
  const Icon = IconMap[type];
  return (
    <div className={`notice notice__${type}`}>
      <Icon />
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};

export { Notice };
