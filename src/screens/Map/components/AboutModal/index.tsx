import { i18n } from '@core';
import { Log } from '@core/log';
import { ViewStyleProps } from '@styles';
import { errToStr } from '@utils';
import { Modal, Button, Text } from 'native-base';
import React, { FC } from 'react';
import { Linking } from 'react-native';

const log = Log('screens.Map.AboutModal');

interface Props extends ViewStyleProps {
  open: boolean;
  onClose: () => void;
}

export const AboutModal: FC<Props> = ({ open, onClose }) => {
  const handleUrlPress = async (val: string) => {
    try {
      await Linking.openURL(val);
    } catch (err: unknown) {
      log.err('open link err', { msg: errToStr(err) });
    }
  };
  const title = i18n({ uk: 'Про додаток', ru: 'Про приложение', en: 'About' });

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content size="full">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text fontSize="md">
            {`Додаток створений на основі відкритих даних взятих з офіційного сайту `}
            <Text underline onPress={() => handleUrlPress('https://www.kremen.gov.ua/index.php?view=info-bus')}>
              {`Кременчуцької міської ради`}
            </Text>
          </Text>
          <Text fontSize="md" mt={3}>{`Додаток не є комерційним та розроблений винятково силами волонтерів.`}</Text>
          <Text fontSize="md" mt={3}>{`З питаннями, пропозиціями та інформацією про помилки звертатись:`}</Text>
          <Text fontSize="md" mt={3} underline onPress={() => handleUrlPress('mailto:hello@smartapp.dev')}>
            {`hello@smartapp.dev`}
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={onClose}>{i18n({ uk: 'Закрити', ru: 'Закрыть', en: 'Close' })}</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export type AboutModalProps = Props;
export default AboutModal;
