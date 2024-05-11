# Switchblade SDK
The Switchblade SDK provides an easy way to interface with [Switchblade](https://github.com/Mikebeas/switchblade) servers.

# Latest Changes
You can see what's new in each version of the Switchblade SDK in [the change log document](https://github.com/MikeBeas/switchblade-sdk/blob/master/changelog.md).

# Installation and Requirements
This package relies on `fetch`, so it requires Node v18 or higher.

Install the SDK:


```
npm install switchblade-sdk
```

# Usage
To use the SDK, instantiate the `SwitchbladeSDK` class with the hostname for your Switchblade server.

## Setup

To get started, import and instantiate the `SwitchbladeSDK` class with a hostname for your Switchblade server.

```js
// lib/switchblade.js
import env from 'react-dotenv';
import { SwitchbladeSDK } from 'switchblade-sdk';

const hostname = env.SWITCHBLADE_API_HOST;

export const switchblade = new SwitchbladeSDK({
  hostname
});
```

You can can also set or update the hostname at any time:
```js
import { switchblade } from './lib/switchblade';

switchblade.setHost("https://my.new.hostname.example.com");
```

You can also use the Switchblade SDK in Node projects:

```js
const { SwitchbladeSDK } = require('switchblade-sdk');
```

## Authentication

You can authenticate the user several different ways. The first way is by providing an authentication token to the `SwitchbladeSDK` constructor:

In this example, we'll setup a `SwitchbladeSDK` instance for a React application that uses `react-dotenv` to load the hostname from environment variables and persists the user's authentication token in `localStorage`.

```js
// lib/switchblade.js
import env from 'react-dotenv';
import { SwitchbladeSDK } from 'switchblade-sdk';

export const switchblade = new SwitchbladeSDK({
  hostname: env.SWITCHBLADE_API_HOST,
  token: localStorage.getItem("token")
});
```

If no token is available at the time of instantiation, you can set the token later:

```js
// index.js
import { switchblade } from './lib/switchblade';

switchblade.authenticate("user_token");
```

The user's authentication should be cleared out when they are logged out of your application.

```js
// index.js
import { switchblade } from './lib/switchblade';

const logout = () => {
  localStorage.removeItem("token");
  switchblade.authenticate();
}
```

If you provide a token to the SDK, that token will be checked for expiration during all network activity, even to endpoints that have support for unauthenticated calls. If you wish to make unauthenticated calls, clear out the authentication token as described above.

You should also provide the SDK with a callback function to be executed if an API call is attempted with an expired token. You can do this one of three ways:

1. Directly in the constructor
1. As an optional second parameter to `authenticate()`
1. Using a standalone `setExpiredTokenHandler(callback: () => void)` method

```js
import env from 'react-dotenv';
import { SwitchbladeSDK } from 'switchblade-sdk';
import { useDispatch } from 'react-redux';
import { showTimeoutMessage } from './actions';

// setup environment details
const hostname = env.SWITCHBLADE_API_HOST;

const App = () => {
  const dispatch = useDispatch();

  // create handler
  const expiredTokenHandler = () => {
    dispatch(showTimeoutMessage());
  }

  // instantiate switchblade-sdk
  export const switchblade = new SwitchbladeSDK({
    hostname,
    token: localStorage.getItem("token"),
    expiredTokenHandler // option 1
  });

  switchblade.authenticate("user_token", logout);  // option 2

  switchblade.setExpiredTokenHandler(logout); // option 3

  return <div />
}
```

If no handler is set and the token used for an API call is expired, the SDK will throw an `Error`. You can catch this error in your app if you prefer.

Note that updating the expired token handler must be done explicitly using the `setExpiredTokenHandler()` method. Calling `authenticate()` with no parameters will not remove an existing handler. This is so you can use `authenticate(token)` to update the token without having to pass the handler back in every time. The second parameter is only provided as a convenience so that you can setup your handler at the same time you are logging your user in.

## Making API Calls

You can verify certain aspects of a `SwitchbladeSDK` instance's status using a variety of methods.

The `hasHost()` method will return a boolean indicating whether it has a hostname configured. You can read the host value with `getHost()`.

You can check whether a token is set by calling `hasToken()`.

If you need to check whether the current token is expired, you can use `isTokenExpired()`. This will also return true if no token is set, so you should not use a `false` response as a sign that a token is set and simply expired. You can combine this with `hasToken()` if you need to differentiate between a missing token and an expired one.

Note that attempting to make an API call with an expired token will invoke your `expiredTokenHandler`, so you do not always need to manually check whether a token is expired before using it.

```js
import { switchblade } from './lib/switchblade';

// check if hostname is set
if (switchblade.hasHost()) {
  if (!switchblade.hasToken()) {
    dispatch(setMessage('No token!'))
  } else if (switchblade.isTokenExpired()) {
    dispatch(setMessage('Token is expired!'))
  } else {
    dispatch(setMessage('Good token!'))
  }
} else {
  dispatch(setMessage('No hostname!'))
}
```

If an endpoint requires authentication, it will return an error in the response body (identical to the response you'd get if calling the API directly) if called without a token. Endpoints that support unauthenticated calls will continue to work as expected for an unauthenticated user (i.e., certain data and options may not be available, such as getting shortcut drafts).

# Handling Errors

The Switchblade SDK has two methods of handling errors. The default behavior is to simply pass the output from the API call to your application and let you decide what to do with it. You can usually apply endpoint-specific logic (such as looking for a `message` in the response) to detect errors.

Alternatively, you can specify that you want the SDK to throw when it encounters an error in the API response. This will throw a standard `Error` with a `message` containing the error message from the API. You can configure this behavior in the SDK constructor using the `throwOnError` property, or later using the `setThrowOnError` method.

In the example below, you'll see both options for setting the error handling behavior demonstrated.

```js
import env from 'react-dotenv';
import { SwitchbladeSDK } from 'switchblade-sdk';
import { useDispatch } from 'react-redux';
import { showTimeoutMessage } from './actions';

// setup environment details
const hostname = env.SWITCHBLADE_API_HOST;

const App = () => {
  const dispatch = useDispatch();

  // instantiate switchblade-sdk
  export const switchblade = new SwitchbladeSDK({
    hostname,
    token: localStorage.getItem("token"),
    throwOnError: true // option 1
  });

  switchblade.setThrowOnError(true); // option 2

  return <div />
}
```


# Available Methods
SDK methods are namespaced for clarity. All methods return the API response directly without any modification.

See the API documents that correspond to a given version of Switchblade for information on the usage of each endpoint and its response.

## Core
These methods are available in the `switchblade.core` namespace. They deal with general functionality like server configuration checks and authentication.

```ts
switchblade.core.getServerConfig() // GET /
switchblade.core.login(params: LoginParams) // POST /login
switchlade.core.verifySession() // GET /verify
```

## Setup
This method is available in the `switchblade.setup` namespace. It is only used for setting up new installations of Switchblade.

Note that there is no method for the `POST /hash-password` method.

```ts
switchblade.setup.setup(body: UserParams) // POST /setup
```

## Users
These methods are available in the `switchblade.users` namespace. They deal with listing and managing users.


```ts
switchblade.users.list(params: UsersSearchParams) // GET /users
switchblade.users.get(userId: string | number) // GET /users/{userId}
switchblade.users.create(body: UsersParams) // POST /users
switchblade.users.modify(userId: string | number, body: UsersParams) // PATCH /users/{userId}
```

## Shortcuts
These methods are available in the `switchblade.shortcuts` namespace. They deal with listing and managing shortcuts.


```ts
switchblade.shortcuts.list(params: ShortcutSearchParams) // GET /shortcuts
switchblade.shortcuts.get(shortcutId: string | number) // GET /shortcuts/{shortcutId}
switchblade.shortcuts.create(body: ShortcutParams) // POST /shortcuts
switchblade.shortcuts.modify(shortcutId: string | number, body: ShortcutParams) // PATCH /shortcuts/{shortcutId}
```

## Versions
These methods are available in the `switchblade.versions` namespace. They deal with listing and managing shortcut versions.


```ts
switchblade.versions.list(shortcutId: string | number, params: VersionSearchParams) // GET /shortcuts/{shortcutId}/history
switchblade.versions.get(shortcutId: string | number, versionNumber: string) // GET /shortcuts/{shortcutId}/version/{versionNumber}
switchblade.versions.getLatest(shortcutId: string | number) // GET /shortcuts/{shortcutId}/version/latest
switchblade.versions.create(shortcutId: string | number, body: VersionParams) // POST /shortcuts/{shortcutId}/version
switchblade.versions.modify(shortcutId: string | number, versionNumber: string, body: VersionPatchParams) // PATCH /shortcuts/{shortcutId}/versions/{versionNumber}
```

## Me
These methods are available in the `switchblade.me` namespace. They deal with managing the currently-authenticated user.


```ts
switchblade.me.get() // GET /me
switchblade.me.beginMfaSetup() // POST /me/mfa/setup
switchblade.me.completeMfaSetup(otp: string) // POST /me/mfa/complete
switchblade.me.disableMfa() // DELETE /me/mfa
switchblade.me.modify(body: UserParams) // PATCH /me
```

## Autocomplete
These methods are available in the `switchblade.autocomplete` namespace. These endpoints are lightweight search endpoints that can be used to populate autocomplete fields.


```ts
switchblade.autocomplete.users(search: string) // GET /autocomplete/users
```

# The `sdk` Object

The package also exports an `sdk` object with basic metadata about itself. The `version` property in particular can be useful for troubleshooting. These details are read from the SDK's `package.json` at build time and will always reflect the actual details of the installed package.

```js
import { sdk } from 'switchblade-sdk`;

console.log(`The current version of the Switchblade SDK is ${sdk.version}`);
// The current version of the Switchblade SDK is 1.0.0
```