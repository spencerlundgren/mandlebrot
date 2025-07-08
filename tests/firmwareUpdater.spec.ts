
import { DeviceManager } from '../src/deviceManager';
import { FirmwareUpdater } from '../src/firmwareUpdater';

describe.skip('FirmwareUpdater', () => {
  let manager: DeviceManager;
  let updater: FirmwareUpdater;

  beforeEach(() => {
    manager = new DeviceManager();
    updater = new FirmwareUpdater(manager);
  });

  afterEach(() => {
    updater.destroy();
  });

  it('should queue update for offline device', () => {
    const result = updater.requestUpdate('offline-device', '0.0.2');
    expect(result).toBe(false);
    expect(updater.listPendingUpdates()).toContain('offline-device');
  });

  it('should update for online device', () => {
    manager.deviceCheckIn('online-device');
    const result = updater.requestUpdate('online-device', '0.0.3');
    expect(result).toBe(true);
  });

  it('should update the firmware version of an online device', async () => {
    let onUpdated!: (deviceId: string) => void;
    const waitForMe = new Promise<void>((resolve) => {
      onUpdated = (deviceId) => {
        resolve();
      }
    });
    const requestedVersion = '1.2.3';
    manager.registerDevice('online-device');
    manager.deviceCheckIn('online-device');
    updater.requestUpdate('online-device', requestedVersion, onUpdated);
    await waitForMe;
    expect(manager.getFirmwareVersion('online-device')).toStrictEqual(requestedVersion);
  });

  it.skip('should remove pending updates when those complete', async () => {
    const deviceId = 'offline-device';
    let onUpdated!: (deviceId: string) => void;
    const waitForMe = new Promise<void>((resolve) => {
      onUpdated = (updatedId) => {
        if (deviceId === updatedId) {
          resolve();
        }
      }
    });
    const requestedVersion = '4.1.1';

    manager.registerDevice(deviceId);
    updater.requestUpdate(deviceId, requestedVersion, onUpdated);
    expect(updater.listPendingUpdates()).toContain(deviceId);
    manager.deviceCheckIn(deviceId);

    await waitForMe;
    expect(manager.getFirmwareVersion(deviceId)).toStrictEqual(requestedVersion);
    expect(updater.listPendingUpdates().length).toStrictEqual(0);
  });

});
