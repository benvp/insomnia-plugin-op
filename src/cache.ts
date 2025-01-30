import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 60 });

export function writeEntry(ref: string, value: string | number, ttl?: number) {
  if (typeof ttl === 'number') {
    return cache.set(ref, value, ttl);
  }

  return cache.set(ref, value);
}

export function getEntry(ref: string) {
  return cache.get(ref);
}

export function opCliInstalled() {
  return cache.get('opCliInstalled');
}

export function writeOpCliInstalled(installed: boolean, ttl?: number) {
  if (typeof ttl === 'number') {
    return cache.set('opCliInstalled', installed, ttl);
  }

  return cache.set('opCliInstalled', installed);
}
