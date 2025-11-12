declare module 'winston-daily-rotate-file' {
  import { TransportStreamOptions } from 'winston-transport';
  import TransportStream = require('winston-transport');

  interface DailyRotateFileTransportOptions extends TransportStreamOptions {
    filename?: string;
    datePattern?: string;
    zippedArchive?: boolean;
    maxSize?: string | number;
    maxFiles?: string | number;
    utc?: boolean;
    auditFile?: string;
    level?: string;
    format?: any;
  }

  class DailyRotateFile extends TransportStream {
    constructor(options?: DailyRotateFileTransportOptions);
  }

  export = DailyRotateFile;
}
