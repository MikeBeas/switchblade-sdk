# v1.1.0 (2023-10-04)
- Added `switchblade.users` namespace to support new endpoints available in Switchblade 1.2.0.
- Added `switchblade.autocomplete` namespace to support new endpoints available in Switchblade 1.2.0.
- Updated types to add `creatorId` on `switchblade.users.get` and `switchblade.shortcuts.get` for Switchblade 1.2.0.
- Corrected an issue where `undefined` or `null` values could be sent as strings when used as query parameters.
- Corrected an issue with the `ShortcutParams` type that could cause the `name` property to be marked as required when updating a shortcut. The name is not required when updating a shortcut, only during creation.
- Corrected an issue with the `VersionPatchParams` type that could cause the `url` property to be marked as required when updating a version. The URL is not required when updating a version, only during creation.

# v1.0.0 (2023-06-07)
- Initial release