import { Type } from './types';

export function toId(type: Type, id: string | number) {
  return `${type}:${id}`;
}

export function fromId(id: string) {
  return id.split(':');
}
