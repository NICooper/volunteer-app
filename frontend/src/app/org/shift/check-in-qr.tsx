import { apiUrl } from '@/src/global';
import { generateCheckInOutCode } from '@/src/queries/query-check-in-out';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Appbar, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { UserContext } from '../../_layout';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckInOutQR() {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const qrCodeSize = width * 0.85 - insets.left - insets.right;
  const quietZoneSize  = width * 0.05;

  const params = useLocalSearchParams<{ action: 'checkin' | 'checkout', shiftId: string, eventId: string }>();

  const shiftId = parseInt(params.shiftId);
  const eventId = parseInt(params.eventId);

  const qrQuery = useQuery({
    queryKey: ['checkInOut', shiftId, params.action],
    queryFn: () => generateCheckInOutCode(params.action, user?.id!, shiftId, eventId),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 4 * 60 * 1000
  });

  const qrData = qrQuery.data;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={`Check ${params.action === 'checkin' ? 'In' : 'Out'}`} />
      </Appbar.Header>
      <View style={styles.container}>
        { qrQuery.isPending
          ? <ActivityIndicator />
          : qrQuery.isSuccess
            ? (<View style={styles.qr}>
                <QRCode
                  value={qrData?.id}
                  size={qrCodeSize}
                  quietZone={quietZoneSize}
                />
                <Text variant='titleLarge' style={styles.text}>Scan QR code in app to {params.action === 'checkin' ? 'check in' : 'check out'}.</Text>
                <Text variant='titleMedium' style={styles.text}>Select the Profile tab then choose the shift at the top of your screen.</Text>
              </View>)
            : <Text variant='titleMedium'>Error generating QR code.</Text>
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  qr: {
    padding: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginTop: 24,
    textAlign: 'center'
  }
});
