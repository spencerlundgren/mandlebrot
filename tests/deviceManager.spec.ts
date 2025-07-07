import { DeviceManager, OFFLINE_THRESHOLD_MS } from '../src/deviceManager';

describe.skip('DeviceManager', () => {
  let manager: DeviceManager;

  beforeEach(() => {
    manager = new DeviceManager();
  });

  it('should register and check in a device', () => {
    manager.registerDevice('device-1');
    expect(manager.listDevices().length).toBe(1);

    manager.deviceCheckIn('device-1');
    const device = manager.listDevices()[0];
    expect(device.id).toBe('device-1');
  });

  it('should auto-register unknown device on check-in', () => {
    manager.deviceCheckIn('device-2');
    expect(manager.listDevices().some(d => d.id === 'device-2')).toBe(true);
  });

  it('should show devices as offline until they check in', () => {
    manager.registerDevice('device-3');
    expect(manager.isOnline('device-3')).toBe(false);
  });

  it('should show devices as online right after they check in', () => {
    manager.registerDevice('device-4');
    manager.deviceCheckIn('device-4');
    expect(manager.isOnline('device-4')).toBe(true);
  });

  it('should show devices as offline if they have not checked in passed offline threshold', async () => {
    manager.registerDevice('device-5');
    manager.deviceCheckIn('device-5');
    await delay(OFFLINE_THRESHOLD_MS + 1);
    expect(manager.isOnline('device-5')).toBe(false);
  });

  it('should show devices as online if they have checked in during offline threshold', async () => {
    manager.registerDevice('device-6');
    manager.deviceCheckIn('device-6');
    await delay(OFFLINE_THRESHOLD_MS - 1);
    expect(manager.isOnline('device-6')).toBe(true);
  });

  it('should show offline for non-existent device', () => {
    expect(manager.isOnline('nonexistent')).toBe(false);
  });
});


function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
