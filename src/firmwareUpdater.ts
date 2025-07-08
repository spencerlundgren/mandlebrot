
import { DeviceManager } from './deviceManager';

export class FirmwareUpdater {
  private pendingUpdates: Set<string> = new Set();
  private interval: NodeJS.Timeout;

  constructor(private deviceManager: DeviceManager) {
    this.interval = setInterval(() => {
      this.attemptPendingUpdates();
    }, 20)
  }

  destroy() {
    this.interval.close();
  }

  requestUpdate(
    deviceId: string,
    requestedVersion: string,
    callbackWhenComplete?: (deviceId: string) => void,
  ): boolean {
    if (!this.deviceManager.isOnline(deviceId)) {
      this.pendingUpdates.add(deviceId);
      return false;
    }
    this.deviceManager.updateDeviceFirmware(deviceId, requestedVersion);
    return true;
  }

  listPendingUpdates(): string[] {
    return Array.from(this.pendingUpdates);
  }

  private attemptPendingUpdates() {
    const firmwareVersion = '1.1.1';
    if (this.pendingUpdates.size > 0) {
      for (const deviceId of this.pendingUpdates.values()) {
        const isOnline = this.deviceManager.isOnline(deviceId);
        if (isOnline) {
          this.deviceManager.updateDeviceFirmware(deviceId, firmwareVersion);
        }
      }
    }
  }
}
