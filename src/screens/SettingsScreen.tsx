import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useCurrency} from '../store/CurrencyContext';
import {Colors, Radius, Spacing, Typography} from '../theme';

function SettingsScreen() {
  const {isOffline, isLoading, refreshRates, clearCache, rates} = useCurrency();
  const [clearing, setClearing] = useState(false);

  async function handleClearCache() {
    setClearing(true);
    try {
      await clearCache();
    } finally {
      setClearing(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status section */}
        <Text style={styles.sectionLabel}>STATUS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Network</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOffline
                    ? Colors.error
                    : Colors.primary,
                },
              ]}
            />
            <Text style={styles.rowValue}>
              {isOffline ? 'Offline' : 'Online'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Rate Date</Text>
            <Text style={styles.rowValue}>
              {rates?.date ?? '—'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Base Currency</Text>
            <Text style={styles.rowValue}>{rates?.base ?? '—'}</Text>
          </View>
        </View>

        {/* Cache section */}
        <Text style={styles.sectionLabel}>CACHE</Text>
        <View style={styles.card}>
          <Text style={styles.cacheDescription}>
            Rates are cached for 1 hour. When offline, cached rates are used
            automatically.
          </Text>
          <View style={styles.divider} />
          <Pressable
            style={styles.actionRow}
            onPress={refreshRates}
            disabled={isLoading}>
            <Text style={styles.actionLabel}>Refresh Rates</Text>
            {isLoading ? (
              <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
              <Text style={styles.actionChevron}>↻</Text>
            )}
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.actionRow}
            onPress={handleClearCache}
            disabled={clearing}>
            <Text style={[styles.actionLabel, styles.destructiveText]}>
              Clear Cache
            </Text>
            {clearing ? (
              <ActivityIndicator color={Colors.error} size="small" />
            ) : (
              <Text style={[styles.actionChevron, styles.destructiveText]}>
                ›
              </Text>
            )}
          </Pressable>
        </View>

        {/* About section */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Data Source</Text>
            <Text style={styles.rowValue}>Frankfurter (ECB)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Update Frequency</Text>
            <Text style={styles.rowValue}>Every business day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(SettingsScreen);

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
  content: {
    padding: Spacing.gutter,
    gap: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.dataLabel,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  rowLabel: {
    ...Typography.bodyReg,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  rowValue: {
    ...Typography.bodyReg,
    color: Colors.onSurface,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  cacheDescription: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    padding: Spacing.md,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionLabel: {
    ...Typography.bodyReg,
    color: Colors.techBlue,
    flex: 1,
  },
  actionChevron: {
    color: Colors.techBlue,
    fontSize: 18,
  },
  destructiveText: {
    color: Colors.error,
  },
});
