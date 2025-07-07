
import { DeviceManager } from './deviceManager';

export class FirmwareUpdater {
  private pendingUpdates: Set<string> = new Set();

  constructor(private deviceManager: DeviceManager) {}

  requestUpdate(deviceId: string): boolean {
    if (!this.deviceManager.isOnline(deviceId)) {
      this.pendingUpdates.add(deviceId);
      return false; // queued
    }
    return true; // update started
  }

  checkForPendingUpdates(deviceId: string): boolean {
    if (this.pendingUpdates.has(deviceId) && this.deviceManager.isOnline(deviceId)) {
      this.pendingUpdates.delete(deviceId);
      return true;
    }
    return false;
  }

  listPendingUpdates(): string[] {
    return Array.from(this.pendingUpdates);
  }

  // Phase 5: Persistence methods
  saveState(storage: { save: (key: string, value: string[]) => void }): void {
    storage.save('pending', this.listPendingUpdates());
  }

  loadState(storage: { load: (key: string) => string[] }): void {
    const saved = storage.load('pending');
    saved.forEach(id => this.pendingUpdates.add(id));
  }

  // Phase 6: Async simulated update trigger
  async delayedCheckInAndUpdate(deviceId: string, delayMs: number = 100): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    this.deviceManager.registerDevice(deviceId);
    return this.checkForPendingUpdates(deviceId);
  }
}
