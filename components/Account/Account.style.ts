import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .account-wrapper {
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 8rem;
    height: 3rem;
  }

  .account-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.8rem;
    cursor: pointer;
    font-size: 1.8rem;
    color: ${vars.grey1};

    :global(svg) {
      fill: ${vars.grey1};
    }

    &:hover {
      color: ${vars.grey4};
      :global(svg) {
        fill: ${vars.grey4};
      }
    }
  }
`;
