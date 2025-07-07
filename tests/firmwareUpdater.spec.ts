
import { DeviceManager } from '../src/deviceManager';
import { FirmwareUpdater } from '../src/firmwareUpdater';

// Optional: Fake storage layer for Phase 5
class FakeStorage {
  private store: Record<string, string[]> = {};

  save(key: string, value: string[]): void {
    this.store[key] = [...value];
  }

  load(key: string): string[] {
    return this.store[key] || [];
  }
}

describe('FirmwareUpdater', () => {
  let manager: DeviceManager;
  let updater: FirmwareUpdater;

  beforeEach(() => {
    manager = new DeviceManager();
    updater = new FirmwareUpdater(manager);
  });

  it.only('should queue update for offline device', () => {
    const result = updater.requestUpdate('offline-device');
    expect(result).toBe(false);
    expect(updater.listPendingUpdates()).toContain('offline-device');
  });

  it('should trigger update for online device', () => {
    manager.registerDevice('online-device');
    const result = updater.requestUpdate('online-device');
    expect(result).toBe(true);
  });

  it('should trigger pending update when device comes online', () => {
    updater.requestUpdate('device-123');
    manager.registerDevice('device-123');
    const triggered = updater.checkForPendingUpdates('device-123');
    expect(triggered).toBe(true);
    expect(updater.listPendingUpdates()).not.toContain('device-123');
  });

  it('should not trigger update for still-offline device', () => {
    updater.requestUpdate('device-abc');
    const result = updater.checkForPendingUpdates('device-abc');
    expect(result).toBe(false);
  });

  // Phase 5: Persistence Simulation
  it('should persist and restore pending updates', () => {
    const storage = new FakeStorage();

    updater.requestUpdate('device-x');
    updater.requestUpdate('device-y');

    storage.save('pending', updater.listPendingUpdates());

    const saved = storage.load('pending');
    expect(saved).toEqual(['device-x', 'device-y']);
  });

  // Phase 6: Simulated Async Check-In
  it('should simulate delayed device check-in and trigger update', async () => {
    updater.requestUpdate('delayed-device');

    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay

    manager.registerDevice('delayed-device');

    const triggered = updater.checkForPendingUpdates('delayed-device');
    expect(triggered).toBe(true);
  });
});
