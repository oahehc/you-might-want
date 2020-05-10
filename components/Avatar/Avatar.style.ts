import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    /* TODO: generate different gradient base on letter: https://webkul.github.io/coolhue/ */
    background-image: linear-gradient(135deg, #abdcff 10%, #0396ff 100%);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    color: ${vars.white};

    &.s {
      width: 16px;
      height: 16px;
      font-size: 10px;
    }
    &.m {
      width: 24px;
      height: 24px;
      font-size: 14px;
    }
    &.l {
      width: 36px;
      height: 36px;
      font-size: 18px;
      font-weight: 600;
    }
  }
`;
