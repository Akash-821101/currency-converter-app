import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useCurrency} from '../store/CurrencyContext';
import CurrencyPickerModal from '../components/CurrencyPickerModal';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {formatRate} from '../utils/formatting';

function RatesScreen() {
  const {
    fromCurrency,
    currencies,
    rates,
    isLoading,
    isOffline,
    setFromCurrency,
    refreshRates,
  } = useCurrency();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');

  const rateEntries = rates
    ? Object.entries(rates.rates)
        .filter(([code]) => {
          const q = search.toLowerCase();
          if (!q) return true;
          const name =
            currencies.find(c => c.code === code)?.name.toLowerCase() ?? '';
          return code.toLowerCase().includes(q) || name.includes(q);
        })
        .sort((a, b) => a[0].localeCompare(b[0]))
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Rates</Text>
        {isOffline && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>CACHED</Text>
          </View>
        )}
      </View>

      {/* Base selector */}
      <Pressable
        style={styles.baseSelector}
        onPress={() => setPickerVisible(true)}>
        <View>
          <Text style={styles.baseSelectorLabel}>BASE CURRENCY</Text>
          <Text style={styles.baseSelectorCode}>{fromCurrency}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <TextInput
        style={styles.searchInput}
        placeholder="Filter currencies…"
        placeholderTextColor={Colors.onSurfaceVariant}
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {rates && (
        <Text style={styles.dateLabel}>
          ECB rates · {rates.date}
        </Text>
      )}

      {isLoading && !rates ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={rateEntries}
          keyExtractor={item => item[0]}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshRates}
              tintColor={Colors.primary}
            />
          }
          renderItem={({item: [code, rate]}) => {
            const name =
              currencies.find(c => c.code === code)?.name ?? code;
            return (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rateCode}>{code}</Text>
                  <Text style={styles.rateName} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
                <Text style={styles.rateValue}>{formatRate(rate)}</Text>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <CurrencyPickerModal
        visible={pickerVisible}
        currencies={currencies}
        selectedCode={fromCurrency}
        onSelect={code => {
          setFromCurrency(code);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

export default memo(RatesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  offlineBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  offlineText: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
  },
  baseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    margin: Spacing.gutter,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  baseSelectorLabel: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  baseSelectorCode: {
    ...Typography.h2,
    color: Colors.primary,
  },
  chevron: {
    color: Colors.onSurfaceVariant,
    fontSize: 24,
  },
  searchInput: {
    marginHorizontal: Spacing.gutter,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    ...Typography.bodyReg,
    color: Colors.onSurface,
  },
  dateLabel: {
    ...Typography.dataLabel,
    color: Colors.outlineVariant,
    marginHorizontal: Spacing.gutter,
    marginBottom: Spacing.xs,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.sm,
  },
  rowLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  rateCode: {
    ...Typography.dataLabel,
    color: Colors.primary,
    marginBottom: 2,
  },
  rateName: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  rateValue: {
    ...Typography.inputText,
    color: Colors.onSurface,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.gutter,
  },
});
