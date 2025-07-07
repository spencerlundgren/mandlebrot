
export const OFFLINE_THRESHOLD_MS = 10;

interface Device {
  id: string;
  status: 'registered' | 'online' | 'offline';
  lastCheckedInMs: number;
};

export class DeviceManager {
  private devices: {[deviceId: string]: Device} = {};

  registerDevice(id: string): void {
    this.devices[id] = {id, status: 'registered', lastCheckedInMs: 0};
  }

  deviceCheckIn(id: string): void {
    const device = this.devices[id];
    device.status = 'online';
  }

  isOnline(id: string): boolean {
    const deviceInfo = this.devices[id];
    return deviceInfo.status === 'online' ? true : false;
  }

  listDevices(): Device[] {
    return Object.values(this.devices);
  }

  private getMsBetweenDates(historyDate: Date, laterDate: Date): number {
    return laterDate.getTime() - historyDate.getTime();
  }

}
