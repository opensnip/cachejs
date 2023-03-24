declare type cacheEvictionPolicy = "FIFO" | "LIFO" | "LRU" | "MRU";

declare class Cache {
  length: number;
  constructor(options?: {
    evictionPolicy?: cacheEvictionPolicy;
    maxLength?: number;
    ttl?: number;
    interval?: number;
    enableInterval?: boolean;
  });
  set: (key: any, value: any, options?: { ttl?: number }) => void;
  startInterval: () => void;
  clearInterval: () => void;
  get: (
    key: any,
    callback?: (err: Error | undefined, value: any) => any
  ) => any;
  delete: (key: any) => void;
  clear: () => void;
  has: (key: any) => boolean;
  forEach: (callback: (element: object, index?: number) => void) => void;
  toArray: () => any[];
}

export default Cache;
