export interface ISite {
  id: number;
  username: string;
  title: string;
  updates: number;
  followers: number;
  views: number;
  created_at: number;
  updated_at: number;
}

export class Site implements ISite {
  id!: number;
  username!: string;
  title!: string;
  updates!: number;
  followers!: number;
  views!: number;
  created_at!: number;
  updated_at!: number;
}

export interface IFolder {
  name: string;
  dir: boolean;
}

export class Folder implements IFolder {
  name!: string;
  dir!: boolean;
};

export interface IBigId {
  id: string;
}

export class BigId implements IBigId {
  id!: string;
}