
const APP_PREFIX = '[MinasbateApp]';

/**
 * A simple logger utility for debugging purposes.
 * It prefixes all messages to make them easily identifiable in the console.
 */
export const logger = {
  log: (...args: any[]) => {
    console.log(APP_PREFIX, ...args);
  },
  info: (...args: any[]) => {
    console.info(APP_PREFIX, ...args);
  },
  warn: (...args: any[]) => {
    console.warn(APP_PREFIX, ...args);
  },
  error: (...args: any[]) => {
    console.error(APP_PREFIX, ...args);
  },
};
