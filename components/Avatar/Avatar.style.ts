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
    margin: 0.2rem;
    color: ${vars.white};

    &.s {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 1rem;
    }
    &.m {
      width: 2.4rem;
      height: 2.4rem;
      font-size: 1.4rem;
    }
    &.l {
      width: 3.6rem;
      height: 3.6rem;
      font-size: 1.8rem;
      font-weight: 600;
    }
  }
`;
