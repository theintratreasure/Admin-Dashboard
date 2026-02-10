export type HealthMemory = {
  rss: number;
  heapUsed: number;
  availableRam: string;
};

export type HealthLogEntry =
  | string
  | {
      level?: string;
      message?: string;
      timestamp?: string;
      [key: string]: unknown;
    };

export type HealthResponse = {
  status: "UP" | "DOWN" | string;
  timestamp: string;
  pid: number;
  uptime: number;
  memory: HealthMemory;
  cpuLoad: number[];
  last15Logs: HealthLogEntry[];
};
