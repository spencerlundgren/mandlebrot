
export const OFFLINE_THRESHOLD_MS = 10;

interface Device {
  id: string;
  status: 'unregistered' | 'registered' | 'online' | 'updating' | 'offline';
  lastCheckedIn: Date;
  firmwareVersion: string;
};

export class DeviceManager {
  private devices: {[deviceId: string]: Device} = {};

  registerDevice(id: string): void {
    this.devices[id] = {id, status: 'registered', lastCheckedIn: new Date(), firmwareVersion: '0.0.1'};
  }

  deviceCheckIn(id: string): void {
    const device = this.devices[id];
    device.status = 'online';
  }

  async updateDeviceFirmware(deviceId: string, firmwareVersion: string): Promise<boolean> {
    if (!this.isOnline(deviceId)) {
      throw new Error('Cannot update offline device');
    }

    return new Promise((resolve, reject) => {
      const msToUpdate = Math.floor(Math.random() * 20);
      setTimeout(() => {
        this.devices[deviceId].firmwareVersion = firmwareVersion;
        resolve(true);
      }, msToUpdate);
    });

  }

  getStatus(id: string): 'unregistered' | 'registered' | 'online' | 'updating' | 'offline' {
    console.log('devices: ', this.devices);
    const device = this.devices[id];
    return device.status;
  }

  isOnline(id: string): boolean {
    const device = this.devices[id];
    if (device) {
      return (device.status === 'online' || device.status === 'updating') ? true : false;
    } else {
      return false;
    }
  }

  getFirmwareVersion(id: string): string {
    const device = this.devices[id];
    return (device.firmwareVersion);
  }

  listDevices(): Device[] {
    return Object.values(this.devices);
  }

}
