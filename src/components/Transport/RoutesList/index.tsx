import { Checkbox } from '@components/Forms';
import { TransportRoute, TransportType } from '@core/api';
import { clearRouteNumber } from '@core/utils';
import { colors, ViewStyleProps } from '@styles';
import { uniq } from 'lodash';
import { Box, Heading, HStack, SectionList, Text, useColorMode, VStack } from 'native-base';
import React, { FC } from 'react';
import { SectionListData, SectionListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';

import { TransportBusRoundedIcon } from '..';

interface Props extends ViewStyleProps {
  items: TransportRoute[];
  selectedSectionIds?: number[];
  selected: number[];
  onSelectedChange?: (newSelected: number[]) => void;
}

interface Section {
  title: string;
  data: TransportRoute[];
}

export const TransportRoutesList: FC<Props> = ({ style, selectedSectionIds, items: routes, selected, onSelectedChange }) => {
  const { colorMode: theme } = useColorMode();

  const sections: Section[] = [];

  if (selectedSectionIds?.length) {
    const items = routes.filter(itm => selectedSectionIds.includes(itm.rid));
    sections.push({ title: 'Обрані', data: items });
  }
  const trolley = routes.filter(itm => itm.type === TransportType.Trolleybus);
  sections.push({ title: 'Тролейбуси', data: trolley });
  const bus = routes.filter(itm => itm.type === TransportType.Bus);
  sections.push({ title: 'Автобуси', data: bus });

  const handleCheckedChange = (itm: TransportRoute) => (checked: boolean) => {
    onSelectedChange && onSelectedChange(checked ? uniq([...selected, itm.rid]) : selected.filter(cur => cur !== itm.rid));
  };

  const renderItem: SectionListRenderItem<TransportRoute> = info => {
    const { item } = info;
    const checked = selected.includes(item.rid);
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
          <HStack space={3} justifyContent="space-between" alignItems="center">
            <TransportBusRoundedIcon size={48} type={item.type} backgroundColor={item.color} />
            <VStack flex="1">
              <Text _dark={{ color: 'warmGray.50' }} color="coolGray.800" bold fontSize="md">
                {clearRouteNumber(item.number)}
              </Text>
              <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }} fontSize="sm">
                {item.name}
              </Text>
            </VStack>
            <VStack justifyContent="center">
              <Checkbox checked={checked} color={theme === 'light' ? colors.primary : colors.white} />
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (info: { section: SectionListData<TransportRoute, Section> }) => (
    <Box pl="4" pr="5" py="2" _light={{ bg: 'muted.300' }} _dark={{ bg: 'muted.800' }}>
      <Heading fontSize="md">{info.section.title}</Heading>
    </Box>
  );

  return (
    <SectionList
      style={[styles.container, style]}
      initialNumToRender={10}
      sections={sections}
      keyExtractor={itm => `${itm.rid}`}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default TransportRoutesList;
