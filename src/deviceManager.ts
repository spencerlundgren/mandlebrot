
export const OFFLINE_THRESHOLD_MS = 10;

interface Device {
  id: string;
  status: 'unregistered' | 'registered' | 'online' | 'offline';
  lastCheckedInMs: number;
  firmwareVersion: string;
};

export class DeviceManager {
  private devices: {[deviceId: string]: Device} = {};

  registerDevice(id: string): void {
    this.devices[id] = {id, status: 'registered', lastCheckedInMs: 0, firmwareVersion: '0.0.1'};
  }

  deviceCheckIn(id: string): void {
    const device = this.devices[id];
    device.status = 'online';
  }

  getStatus(id: string): 'unregistered' | 'registered' | 'online' | 'offline' {
    console.log('devices: ', this.devices);
    const device = this.devices[id];
    return device.status;
  }

  isOnline(id: string): boolean {
    const device = this.devices[id];
    return device.status === 'online' ? true : false;
  }

  listDevices(): Device[] {
    return Object.values(this.devices);
  }

  private getMsBetweenDates(historyDate: Date, laterDate: Date): number {
    return laterDate.getTime() - historyDate.getTime();
  }

}
