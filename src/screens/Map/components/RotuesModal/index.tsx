import { TransportRoute, TransportType } from '@core/api';
import { clearRouteNumber } from '@core/utils';
import { ViewStyleProps } from '@styles';
import { uniq } from 'lodash';
import { Avatar, Box, Checkbox, Heading, HStack, Modal, SectionList, Text, VStack } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { SectionListData, SectionListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';

import busIcon from './assets/bus.png';
import trolleybusIcon from './assets/trolleybus.png';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  selected: number[];
  open: boolean;
  onClose: () => void;
}

interface Section {
  title: string;
  data: TransportRoute[];
}

export const MapRoutesModal: FC<Props> = ({ style, routes, selected, open, onClose }) => {
  const [curSelected, setCurSelected] = useState<number[]>([]);

  useEffect(() => {
    setCurSelected(selected);
  }, [selected]);

  const sections: Section[] = [];

  if (selected.length) {
    const items = routes.filter(itm => selected.includes(itm.rid));
    sections.push({ title: 'Обрані', data: items });
  }
  const trolley = routes.filter(itm => itm.type === TransportType.Trolleybus);
  sections.push({ title: 'Тролейбуси', data: trolley });
  const bus = routes.filter(itm => itm.type === TransportType.Bus);
  sections.push({ title: 'Автобуси', data: bus });

  const handleCheckedChange = (itm: TransportRoute) => (checked: boolean) => {
    setCurSelected(checked ? uniq([...curSelected, itm.rid]) : curSelected.filter(cur => cur !== itm.rid));
  };

  const renderItem: SectionListRenderItem<TransportRoute> = info => {
    const { item } = info;
    const checked = curSelected.includes(item.rid);
    return (
      <TouchableOpacity onPress={() => handleCheckedChange(item)(!checked)}>
        <Box
          borderBottomWidth="1"
          _dark={{
            borderColor: 'gray.600',
          }}
          borderColor="coolGray.200"
          pl="4"
          pr="5"
          py="2"
        >
          <HStack space={3} justifyContent="space-between">
            <Avatar
              size="48px"
              backgroundColor={item.color}
              source={item.type === TransportType.Trolleybus ? trolleybusIcon : busIcon}
            />
            <VStack flex="1">
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                bold
              >
                {clearRouteNumber(item.number)}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize={12}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </VStack>
            <VStack justifyContent="center">
              <Checkbox value="" isChecked={checked} onChange={handleCheckedChange(item)} colorScheme="primary">
                {''}
              </Checkbox>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (info: { section: SectionListData<TransportRoute, Section> }) => (
    <Heading pl="4" pr="5" py="2" fontSize="md" background="muted.300">
      {info.section.title}
    </Heading>
  );

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content size="full">
        <Modal.CloseButton />
        <Modal.Header>{`Маршрути`}</Modal.Header>
        <SectionList
          w="100%"
          sections={sections}
          keyExtractor={itm => `${itm.rid}`}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
        />
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export type MapRoutesModalProps = Props;
export default MapRoutesModal;
