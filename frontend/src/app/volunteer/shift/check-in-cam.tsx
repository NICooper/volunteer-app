import { GlobalSnackbarContext } from '@/src/components/global-snackbar';
import { checkInOutWithCode } from '@/src/queries/query-check-in-out';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Appbar, Text, Button } from 'react-native-paper';
import { UserContext } from '../../_layout';

export default function Cam() {
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const params = useLocalSearchParams<{ shiftId: string }>();
  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);
  const { width } = Dimensions.get('window');
  const cameraSize = width;

  const [permission, requestPermission] = useCameraPermissions();

  const barcodeScannedMutation = useMutation({
    mutationFn: (code: string) => checkInOutWithCode(code, { id: user?.id! }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
      setSnackbarMessage('Successfully checked in/out!');
      router.back();
    },
    onError: (e) => {
      setSnackbarMessage(e.message || 'Error: Could not check in/out.');
    },
    retry: 2,
    retryDelay: 1500
  });

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text variant='titleMedium' style={styles.permissionMessage}>We need your permission to use the camera.</Text>
        <Button onPress={requestPermission} mode='contained' >Grant Permission</Button>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={`Check In/Out`} />
      </Appbar.Header>
      <View style={{...styles.container, maxWidth: cameraSize, maxHeight: cameraSize}}>
        <CameraView
          style={styles.camera}
          facing='back'
          autofocus='on'
          ratio='1:1'
          barcodeScannerSettings={{barcodeTypes: ['qr']}}
          onBarcodeScanned={(scanningResult) => {
            if (!barcodeScannedMutation.isPending) {
              barcodeScannedMutation.mutate(scanningResult.data);
            }
          }}
        />
      </View>
      <Text style={styles.cameraText}>Point the camera at the Check In or Check Out QR code on the organizer's device.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: 18,
  },
  camera: {
    flex: 1,
    height: 500,
    width: '100%',
  },
  cameraText: {
    textAlign: 'center',
    marginTop: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
