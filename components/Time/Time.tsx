import React from 'react';
import styles from './Time.style';

function getDateFromUtcTime(utcTimeString: string): string {
  const index = utcTimeString.indexOf('T');

  if (!index) return '';
  return utcTimeString.substring(0, index);
}

function formatTime(utcTimeString: string): string {
  const date = new Date(utcTimeString);
  const dateTimeStamp = date.getTime();
  const nowTimeStamp = Date.now();

  if (nowTimeStamp - dateTimeStamp < 60 * 59 * 1000) {
    const min = Math.ceil((nowTimeStamp - dateTimeStamp) / 60 / 1000);
    return `${min} minutes before`;
  }
  if (nowTimeStamp - dateTimeStamp < 60 * 60 * 24 * 1000) {
    const hour = Math.floor((nowTimeStamp - dateTimeStamp) / 60 / 60 / 1000);
    return `${hour} hours before`;
  }
  return getDateFromUtcTime(utcTimeString);
}

type Props = {
  utcTimeString: string;
};

const Time: React.FC<Props> = ({ utcTimeString }) => {
  return (
    <time className="wrapper" dateTime={utcTimeString}>
      {formatTime(utcTimeString)}
      <style jsx>{styles}</style>
    </time>
  );
};

export { Time };
