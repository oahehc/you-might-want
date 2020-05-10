import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './Avatar.style';

type Props = {
  src?: string;
  name?: string;
  size: 's' | 'm' | 'l';
  onClick?: () => void;
};

const Avatar = ({ src, name, size, onClick }: Props) => {
  const firstLetter = name ? name[0].toUpperCase() : '?';
  const style = {};

  function handleClick() {
    if (onClick) onClick();
  }

  // only display image if load success
  const [isImgLoaded, setImgLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (src) {
      const imgLoader = new Image();
      imgLoader.onload = () => setImgLoaded(true);
      imgLoader.src = src;
    }
  }, []);

  if (isImgLoaded) {
    // @ts-ignore
    style.backgroundImage = `url(${src})`;
  }

  return (
    <div className={cx('wrapper', size)} style={style} onClick={handleClick}>
      {!isImgLoaded && firstLetter}
      <style jsx>{styles}</style>
    </div>
  );
};

export { Avatar };
