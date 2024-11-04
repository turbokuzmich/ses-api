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

export const Relation = {
  [Type.Role]: RoleRelation,
} as const;
