import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    width: 98%;
    max-width: 50rem;
    margin: 5rem auto 1rem;
    display: grid;
    grid-gap: 0.3rem;
    grid-template-columns: 4rem 10rem auto 10rem 0.5rem; /* 0.5rem extra space to make the content look more like is aligning center */
    grid-template-rows: auto 4.2rem;

    > textarea {
      grid-column: 2 / span 3;
      height: 12rem;
      font-size: 1.8rem;
      padding: 0.5rem;
      resize: none;
      border-color: transparent;
      box-shadow: 0 0 1rem ${vars.grey4};
    }

    > span {
      font-size: 1.2rem;
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
