import { TransportRoutesList } from '@components/Transport';
import { TransportRoute } from '@core/api';
import { ViewStyleProps } from '@styles';
import { Modal } from 'native-base';
import React, { FC, useEffect, useState } from 'react';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  selected: number[];
  open: boolean;
  onClose: () => void;
  onSelectedChange: (val: number[]) => void;
}

export const MapRoutesModal: FC<Props> = ({ routes, selected, open, onClose, onSelectedChange }) => {
  const [curSelected, setCurSelected] = useState<number[]>([]);

  useEffect(() => {
    setCurSelected(selected);
  }, [selected]);

  const handleClose = () => {
    onSelectedChange(curSelected);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <Modal.Content size="full">
        <Modal.CloseButton />
        <Modal.Header>{`Маршрути`}</Modal.Header>
        <TransportRoutesList
          items={routes}
          selected={curSelected}
          selectedSectionIds={selected}
          onSelectedChange={val => setCurSelected(val)}
        />
      </Modal.Content>
    </Modal>
  );
};

export type MapRoutesModalProps = Props;
export default MapRoutesModal;
