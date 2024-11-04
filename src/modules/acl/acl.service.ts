import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenFgaClient } from '@openfga/sdk';
import { type Config } from 'src/config';
import { Relation, Role, Type } from './types';
import { fromId, toId } from './helpers';

@Injectable()
export class AclService {
  private client: OpenFgaClient;

  constructor(private readonly config: ConfigService<Config>) {
    this.client = new OpenFgaClient(this.config.getOrThrow('fga'));
  }

  async getUserRoles(id: number): Promise<Role[]> {
    const { objects } = await this.client.listObjects({
      user: toId(Type.User, id),
      relation: Relation[Type.Role].Assignee,
      type: Type.Role,
    });

    return objects.map((object) => fromId(object)[1] as Role);
  }
}
