import React from 'react';
import cx from 'classnames';
import { MdWarning } from 'react-icons/md';
import { Loading } from '@components/index';
import styles, { modalHeaderStyle, modalFooterStyle } from './Modal.style';

const ModalHeader: React.FC = ({ children }) => (
  <div className="modal__header">
    {children}
    <style jsx>{modalHeaderStyle}</style>
  </div>
);

const ModalFooter: React.FC = ({ children }) => (
  <div className="modal__footer">
    {children}
    <style jsx>{modalFooterStyle}</style>
  </div>
);

type Props = {
  show: boolean;
  width?: string;
  isLoading?: boolean;
  isError?: boolean;
  closeModal?: () => void;
};

class Modal extends React.Component<Props> {
  static Header = ModalHeader;
  static Footer = ModalFooter;

  myRef = React.createRef<HTMLDivElement>();

  clickOutsideClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // @ts-ignore
    if (!this.myRef.current || this.myRef.current.contains(e.target)) {
      return;
    }
    if (this.props.closeModal) {
      this.props.closeModal();
    }
  };

  render() {
    const { show, width, children, isLoading, isError } = this.props;
    const style = {
      width: '80vw',
      maxWidth: '80vw',
    };

    if (width) {
      style.width = width;
      style.maxWidth = width;
    }

    return (
      <div className={cx('modal__wrapper', { show })} onClick={this.clickOutsideClose}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="modal__body" style={style} ref={this.myRef}>
            {isError && (
              <div className="modal__error">
                <MdWarning />
              </div>
            )}
            {children}
          </div>
        )}
        <style jsx>{styles}</style>
      </div>
    );
  }
}

export { Modal };
