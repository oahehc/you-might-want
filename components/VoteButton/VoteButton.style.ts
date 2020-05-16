import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    font-size: 1.6rem;
    margin: 2rem 2rem 0 0;
    cursor: pointer;
    position: relative;

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

    &.plus_animate {
      &::before {
        content: '+1';
        color: ${vars.yellow};
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        animation: likeBtnAnimate 1s ease-in-out 1 normal forwards;
      }
    }
    &.minus_animate {
      &::before {
        content: '-1';
        color: ${vars.grey1};
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        animation: likeBtnAnimate 1s ease-in-out 1 normal forwards;
      }
    }
  }

  @keyframes likeBtnAnimate {
    50% {
      transform: translate(0, -15px);
    }

    100% {
      transform: translate(0, -15px);
      opacity: 0;
    }
  }
`;
