import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    width: 98%;
    max-width: 500px;
    margin: 50px auto 10px;
    display: grid;
    grid-gap: 3px;
    grid-template-columns: 40px 100px auto 100px 5px; /* 5px extra space to make the content look more like is aligning center */
    grid-template-rows: auto 42px;

    > textarea {
      grid-column: 2 / span 3;
      height: 120px;
      font-size: 18px;
      padding: 5px;
      resize: none;
      border-color: transparent;
      box-shadow: 0 0 10px ${vars.grey4};
    }

    > span {
      grid-row: 2 / span 1;
      grid-column: 2 / span 1;
      justify-self: flex-start;
      align-self: flex-end;
      font-style: italic;

      &.yellow {
        color: ${vars.yellow};
        font-weight: 600;
      }
      &.red {
        color: ${vars.red};
        font-weight: 800;
      }
    }

    > .button {
      grid-row: 2 / span 1;
      grid-column: 4 / span 1;
      justify-self: flex-end;
      align-self: flex-end;
    }
  }
`;
