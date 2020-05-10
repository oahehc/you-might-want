import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

const DOT_SIZE = '8px';
const DOT_SPACE = '16px';

export default css`
  @mixin dot($color, $duration, $delay) {
    animation: dot $duration linear $delay infinite;
    background-color: $color;
    content: ' ';
    border-radius: ${DOT_SIZE};
    height: ${DOT_SIZE};
    width: ${DOT_SIZE};
  }

  @keyframes dot {
    0% {
      opacity: 0.2;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0.2;
    }
  }

  .loading__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    .loading__dots {
      &::before {
        @include dot(${vars.grey3}, 2s, 0s);
        position: absolute;
        top: 0;
        left: -${DOT_SPACE};
      }

      @include dot(${vars.grey3}, 2s, 0.5s);
      position: relative;

      &::after {
        @include dot(${vars.grey3}, 2s, 1s);
        position: absolute;
        top: 0;
        right: -${DOT_SPACE};
      }
    }
  }
`;
