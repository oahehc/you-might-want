import React from 'react';
import styles from './Input.style';

type Props = {
  value: string;
  handleChange: (v: string) => void;
  handleSubmit?: () => void;
  placeholder?: string;
};

const Input = ({ value, handleChange, placeholder, handleSubmit }: Props) => {
  function handlePressEnter(e) {
    if (value && e && e.key === 'Enter' && handleSubmit) {
      handleSubmit();
    }
  }

  return (
    <React.Fragment>
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyPress={handlePressEnter}
        placeholder={placeholder || ''}
      />
      <style jsx>{styles}</style>
    </React.Fragment>
  );
};

export { Input };
