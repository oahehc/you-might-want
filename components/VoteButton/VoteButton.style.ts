import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    font-size: 1.6rem;
    margin: 2rem 2rem 0 0;
    cursor: pointer;

    > span {
      margin-left: 0.3rem;
    }

    &.active {
      :global(svg) {
        fill: ${vars.yellow};
      }
      span {
        color: ${vars.yellow};
        font-weight: 600;
      }
    }
    &.disabled {
      :global(svg) {
        fill: ${vars.grey4};
      }
      span {
        color: ${vars.grey4};
      }
    }
  }
`;
