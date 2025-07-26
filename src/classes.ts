export interface ISite {
  main?: boolean;
  id: number;
  folder?: string;
  domain: string;
  title: string;
  updates: number;
  followers: number;
  views: number;
  created_at: number;
  updated_at: number;
}

export class Site implements ISite {
  main?: boolean;
  id!: number;
  folder?: string;
  domain!: string;
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

export interface ILimits {
  general: ILimit,
  big_uploads: ILimit,
  zip: ILimit
}

export class Limits implements ILimits {
  general!: Limit;
  big_uploads!: Limit;
  zip!: Limit;
}

export interface ILimit {
  limit: number,
  remaining: number,
  reset: number
}

export class Limit implements ILimit {
  limit!: number;
  remaining!: number;
  reset!: number;
}