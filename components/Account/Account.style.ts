import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .account-wrapper {
    position: fixed;
    top: 5px;
    right: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 80px;
    height: 30px;
  }

  .account-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px;
    cursor: pointer;
    font-size: 18px;
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
