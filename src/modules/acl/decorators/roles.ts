import { Reflector } from '@nestjs/core';
import { Entity, EntityRelation } from '../types';

export const Roles = Reflector.createDecorator<[Entity, EntityRelation]>();
