// Shortcuts
export type ShortcutState = 0 | "0" | 1 | "1"

export interface ShortcutSearchParams {
  deleted?: boolean
  state?: ShortcutState | ShortcutState[]
}

export interface ShortcutParams {
  name: string
  headline?: string
  description?: string
  state?: ShortcutState
  deleted?: boolean
}


// Versions
export type VersionState = 0 | "0" | 1 | "1"

export interface VersionSearchParams {
  prerelease?: boolean
  deleted?: boolean
  state?: VersionState | VersionState[]
  required?: boolean
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
}

export interface VersionPatchParams {
  notes?: string
  url: string
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
  expiredTokenHandler: () => void
}

export interface LoginParams {
  username?: string
  password?: string
  otp?: string
  mfaToken?: string
}

export interface UserParams {
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