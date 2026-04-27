import React, {memo, useMemo, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {Currency} from '../types';

interface Props {
  visible: boolean;
  currencies: Currency[];
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

function CurrencyPickerModal({
  visible,
  currencies,
  selectedCode,
  onSelect,
  onClose,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return currencies;
    return currencies.filter(
      c =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [currencies, query]);

  function handleSelect(code: string) {
    onSelect(code);
    setQuery('');
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Currency</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or code…"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />

          <FlatList
            data={filtered}
            keyExtractor={item => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => {
              const isSelected = item.code === selectedCode;
              return (
                <Pressable
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => handleSelect(item.code)}>
                  <Text style={styles.code}>{item.code}</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {isSelected && <Text style={styles.check}>✓</Text>}
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
}

export default memo(CurrencyPickerModal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '80%',
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.h2,
    color: Colors.onSurface,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  closeText: {
    color: Colors.onSurfaceVariant,
    fontSize: 16,
  },
  searchInput: {
    margin: Spacing.gutter,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    ...Typography.bodyReg,
    color: Colors.onSurface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.sm,
  },
  rowSelected: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  code: {
    ...Typography.dataLabel,
    color: Colors.primary,
    width: 44,
  },
  name: {
    ...Typography.bodyReg,
    color: Colors.onSurface,
    flex: 1,
  },
  check: {
    color: Colors.primary,
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.gutter,
  },
});
