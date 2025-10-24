export interface MqttSensorData {
  roomID: string;
  temp: number;
  hum: number;
  timestamp: string; 
}

export interface MqttMotionData {
  roomID: string;
  motion: boolean;
  timestamp: string; 
}

export type RoomMap = Record<string, number>;
