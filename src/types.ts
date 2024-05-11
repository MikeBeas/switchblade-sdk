// Users
export interface UserSearchParams {
  deleted?: boolean
  search?: string
}

export interface UserParams {
  username?: string
  password?: string
  deleted?: boolean
  permissions?: object
}


// Shortcuts
export type ShortcutState = 0 | "0" | 1 | "1"

export interface ShortcutSearchParams {
  deleted?: boolean
  state?: ShortcutState | ShortcutState[]
  search?: string
  creatorId?: number | string
}

export interface ShortcutParams {
  name?: string
  headline?: string
  description?: string
  state?: ShortcutState
  deleted?: boolean
  creatorId?: number | string
}


// Versions
export type VersionState = 0 | "0" | 1 | "1"

export interface VersionSearchParams {
  prerelease?: boolean
  deleted?: boolean
  state?: VersionState | VersionState[]
  required?: boolean
  search?: string
  creatorId?: number | string
  sinceVersion?: string
}

export interface VersionParams {
  version: string
  notes?: string
  url: string
  minimumiOS?: string | number
  minimumMac?: string | number
  date?: string
  required?: boolean
  state?: VersionState
  deleted?: boolean
  creatorId?: number | string
}

export interface VersionPatchParams {
  notes?: string
  url?: string
  minimumiOS?: string | number
  minimumMac?: string | number
  date?: string
  required?: boolean
  state?: VersionState
  deleted?: boolean
}


// General
export interface SwitchbladeSDKParams {
  hostname?: string
  token?: string
  expiredTokenHandler: () => void,
  throwOnError?: boolean
}

export interface LoginParams {
  username?: string
  password?: string
  otp?: string
  mfaToken?: string
}

export interface MeParams {
  username?: string
  password?: string
}


// Internal
export const enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE"
}

export interface NetworkConfig {
  token?: string
  body?: object
  method?: Method
  params?: object
}