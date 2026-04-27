import React, {memo} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useCurrency} from '../store/CurrencyContext';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {formatAmount, formatRate, formatDateTime} from '../utils/formatting';
import {ConversionRecord} from '../types';

function HistoryItem({item}: {item: ConversionRecord}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.pair}>
          {item.fromCurrency} → {item.toCurrency}
        </Text>
        <Text style={styles.timestamp}>{formatDateTime(item.timestamp)}</Text>
      </View>
      <View style={styles.cardAmounts}>
        <Text style={styles.fromAmount}>
          {formatAmount(item.fromAmount, 2)} {item.fromCurrency}
        </Text>
        <Text style={styles.arrow}>=</Text>
        <Text style={styles.toAmount}>
          {formatAmount(item.toAmount, 4)} {item.toCurrency}
        </Text>
      </View>
      <Text style={styles.rate}>
        Rate: {formatRate(item.rate)}
      </Text>
    </View>
  );
}

const MemoHistoryItem = memo(HistoryItem);

function HistoryScreen() {
  const {history, clearHistory} = useCurrency();

  function handleClear() {
    Alert.alert(
      'Clear History',
      'Delete all conversion records?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: clearHistory},
      ],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>History</Text>
        {history.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <Text style={styles.clearBtn}>Clear</Text>
          </Pressable>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No conversions yet</Text>
          <Text style={styles.emptySubtitle}>
            Your saved conversions will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({item}) => <MemoHistoryItem item={item} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

export default memo(HistoryScreen);

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
  clearBtn: {
    ...Typography.bodyReg,
    color: Colors.error,
  },
  listContent: {
    padding: Spacing.gutter,
  },
  separator: {
    height: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pair: {
    ...Typography.dataLabel,
    color: Colors.primary,
  },
  timestamp: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
  },
  cardAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  fromAmount: {
    ...Typography.bodyReg,
    color: Colors.onSurface,
  },
  arrow: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  toAmount: {
    ...Typography.bodyReg,
    color: Colors.primary,
    fontWeight: '600',
  },
  rate: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.onSurface,
  },
  emptySubtitle: {
    ...Typography.bodyReg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
