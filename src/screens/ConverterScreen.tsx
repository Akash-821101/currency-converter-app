import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useCurrency} from '../store/CurrencyContext';
import CurrencyPickerModal from '../components/CurrencyPickerModal';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {formatAmount, formatRate, formatDateTime} from '../utils/formatting';

type PickerTarget = 'from' | 'to' | null;

function ConverterScreen() {
  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    currentRate,
    currencies,
    isLoading,
    isOffline,
    error,
    rates,
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    swapCurrencies,
    addToHistory,
  } = useCurrency();

  const [picker, setPicker] = useState<PickerTarget>(null);

  function handleConvert() {
    if (!fromAmount || !toAmount || !currentRate) return;
    addToHistory({
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      rate: currentRate,
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Converter</Text>
        {isOffline && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>OFFLINE</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* From block */}
        <View style={styles.card}>
          <Text style={styles.label}>FROM</Text>
          <Pressable
            style={styles.currencyBtn}
            onPress={() => setPicker('from')}>
            <Text style={styles.currencyCode}>{fromCurrency}</Text>
            <Text style={styles.currencyName}>
              {currencies.find(c => c.code === fromCurrency)?.name ?? ''}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          <TextInput
            style={styles.amountInput}
            value={fromAmount}
            onChangeText={setFromAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.onSurfaceVariant}
            returnKeyType="done"
            onSubmitEditing={handleConvert}
          />
        </View>

        {/* Swap button */}
        <Pressable style={styles.swapBtn} onPress={swapCurrencies}>
          <Text style={styles.swapIcon}>⇅</Text>
        </Pressable>

        {/* To block */}
        <View style={styles.card}>
          <Text style={styles.label}>TO</Text>
          <Pressable
            style={styles.currencyBtn}
            onPress={() => setPicker('to')}>
            <Text style={styles.currencyCode}>{toCurrency}</Text>
            <Text style={styles.currencyName}>
              {currencies.find(c => c.code === toCurrency)?.name ?? ''}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator
              color={Colors.primary}
              style={styles.loader}
            />
          ) : (
            <Text style={styles.resultAmount}>
              {toAmount ? formatAmount(toAmount, 4) : '—'}
            </Text>
          )}
        </View>

        {/* Rate info */}
        {currentRate && rates && (
          <View style={styles.rateRow}>
            <Text style={styles.rateText}>
              1 {fromCurrency} = {formatRate(currentRate)} {toCurrency}
            </Text>
            <Text style={styles.rateDate}>
              {formatDateTime(Date.now())}
              {isOffline ? ' · cached' : ''}
            </Text>
          </View>
        )}

        {/* Error */}
        {error && !isOffline && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Convert button */}
        <Pressable
          style={[
            styles.convertBtn,
            (!fromAmount || !toAmount) && styles.convertBtnDisabled,
          ]}
          onPress={handleConvert}
          disabled={!fromAmount || !toAmount}>
          <Text style={styles.convertBtnText}>Save to History</Text>
        </Pressable>
      </ScrollView>

      <CurrencyPickerModal
        visible={picker === 'from'}
        currencies={currencies}
        selectedCode={fromCurrency}
        onSelect={setFromCurrency}
        onClose={() => setPicker(null)}
      />
      <CurrencyPickerModal
        visible={picker === 'to'}
        currencies={currencies}
        selectedCode={toCurrency}
        onSelect={setToCurrency}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

export default memo(ConverterScreen);

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
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  offlineText: {
    ...Typography.dataLabel,
    color: Colors.error,
  },
  content: {
    padding: Spacing.margin,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  label: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  currencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  currencyCode: {
    ...Typography.h2,
    color: Colors.primary,
  },
  currencyName: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  chevron: {
    color: Colors.onSurfaceVariant,
    fontSize: 20,
  },
  amountInput: {
    ...Typography.displayNum,
    color: Colors.onSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingVertical: Spacing.xs,
  },
  resultAmount: {
    ...Typography.displayNum,
    color: Colors.primary,
    paddingVertical: Spacing.xs,
  },
  loader: {
    paddingVertical: Spacing.lg,
    alignSelf: 'flex-start',
  },
  swapBtn: {
    alignSelf: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swapIcon: {
    fontSize: 20,
    color: Colors.primary,
  },
  rateRow: {
    gap: 4,
  },
  rateText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  rateDate: {
    ...Typography.dataLabel,
    color: Colors.outlineVariant,
  },
  errorBox: {
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.DEFAULT,
    padding: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySm,
    color: Colors.error,
  },
  convertBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.DEFAULT,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  convertBtnDisabled: {
    opacity: 0.4,
  },
  convertBtnText: {
    ...Typography.bodyReg,
    color: Colors.onPrimary,
    fontWeight: '600',
  },
});
