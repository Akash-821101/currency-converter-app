import React, {memo, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useCurrency} from '../store/CurrencyContext';
import {Colors, Radius, Spacing, Typography} from '../theme';

const REGIONS: Record<string, string[]> = {
  'Major': ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'],
  'Asia-Pacific': [
    'CNY', 'HKD', 'SGD', 'KRW', 'INR', 'TWD', 'THB', 'MYR', 'IDR', 'PHP',
  ],
  'Europe': ['NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN'],
  'Americas': ['BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN'],
  'Middle East & Africa': ['AED', 'SAR', 'ILS', 'TRY', 'ZAR', 'EGP', 'NGN'],
};

function CategoriesScreen() {
  const {currencies, setFromCurrency, fromCurrency} = useCurrency();
  const [expanded, setExpanded] = useState<string | null>('Major');

  const currencyMap = useMemo(
    () => Object.fromEntries(currencies.map(c => [c.code, c.name])),
    [currencies],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      <FlatList
        data={Object.keys(REGIONS)}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        renderItem={({item: region}) => {
          const isOpen = expanded === region;
          const codes = REGIONS[region];
          return (
            <View style={styles.section}>
              <Pressable
                style={styles.sectionHeader}
                onPress={() => setExpanded(isOpen ? null : region)}>
                <Text style={styles.sectionTitle}>{region}</Text>
                <Text style={styles.sectionCount}>
                  {codes.length} currencies
                </Text>
                <Text style={styles.chevron}>{isOpen ? '∧' : '∨'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.currencyList}>
                  {codes.map(code => {
                    const isSelected = fromCurrency === code;
                    return (
                      <Pressable
                        key={code}
                        style={[
                          styles.currencyRow,
                          isSelected && styles.currencyRowSelected,
                        ]}
                        onPress={() => setFromCurrency(code)}>
                        <Text style={styles.code}>{code}</Text>
                        <Text style={styles.name} numberOfLines={1}>
                          {currencyMap[code] ?? ''}
                        </Text>
                        {isSelected && (
                          <Text style={styles.selectedTag}>Active</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

export default memo(CategoriesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.onSurface,
  },
  listContent: {
    padding: Spacing.gutter,
    gap: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.onSurface,
    flex: 1,
  },
  sectionCount: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
  },
  chevron: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  currencyList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currencyRowSelected: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  code: {
    ...Typography.dataLabel,
    color: Colors.primary,
    width: 40,
  },
  name: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    flex: 1,
  },
  selectedTag: {
    ...Typography.dataLabel,
    color: Colors.primary,
    backgroundColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
});
