export enum Type {
  User = 'user',
  Entity = 'entity',
  Role = 'role',
  Track = 'track',
  Announcement = 'announcement',
}

export enum RoleRelation {
  Assignee = 'assignee',
}

export enum Role {
  User = 'user',
  Promo = 'promo',
  Artist = 'artist',
}

export enum Entity {
  Music = 'music',
  Announcements = 'announcements',
}

export enum EntityRelation {
  Editor = 'editor',
  Viewer = 'viewer',
}

export const Relation = {
  [Type.Role]: RoleRelation,
  [Type.Entity]: EntityRelation,
} as const;
