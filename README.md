# 1Password CLI Plugin for Insomnia

A plugin to retrieve secrets from your 1Password Vault.

## Motivation

Even though Insomnia can be configured to be end-to-end encrypted I still don't like to have my
secrets stored in plain text. In addition, Insomnia would be another place where I'd need to keep
my secrets within environment variables in sync (e.g. if I change a password).

Using the Plugin system from Insomnia secrets can safely be retrieved from a 1Password Vault
authenticating via e.g. biometrics.

## Getting started

* Install the [1Password CLI](https://developer.1password.com/docs/cli/).
* Install the plugin from the [Insomnia Plugin Hub](https://insomnia.rest/plugins/)

## Configuration

If you install the 1Password CLI via a package manager (like [Homebrew](https://brew.sh/)), then
you need to tell the plugin the path to the CLI.

Add the plugin config into your base environment (replace or remove the account name to use the default 1Password account):

```json
{
  "__op_plugin": {
    "cliPath": "/opt/homebrew/bin/op",
    "defaultAccount": "team-name.1password.com",

    // Passwords are kept in memory for 3600 seconds (1 hour) by default. You can change this TTL here.
    // To access passwords that are added to 1Password before the TTL expires you'll need to restart Insomnia.
    // Use 0 for infinite caching. This will require a restart Insomnia to refresh credentials.
    "cacheTTL": 3600,

    // If you need to set any global flags set them here.
    // For available flags, see https://developer.1password.com/docs/cli/reference/#global-flags
    "flags": {
      "account": "example.1password.com",
    }
  }
}
```

## Usage

1. Hit `Ctrl + Space` and select the `1Password => Fetch Secret` action.
![Usage-1](https://github.com/benvp/insomnia-plugin-op/blob/main/images/plugin-usage-1.png?raw=true)

2. Click on the action and paste a reference to your 1Password Secret.
![Usage-2](https://github.com/benvp/insomnia-plugin-op/blob/main/images/plugin-usage-2.png?raw=true)

3. Add a custom account name, or leave empty to use the default account.

As an alternative, you can also add the secret reference to your environment variables and
reference this variable inside the action.

## Caveats

Due to the fact that Insomnia retrieves the values every time when you e.g. hover over a variable
the plugin uses `node-cache` to cache secrets for one hour. If you want to purge the cache,
restart Insomnia.

## Acknowledgements

* Huge thanks to the the folks at [1Password](https://1password.com) for creating an awesome
password manager.
* Thanks to [Insomnia](https://insomnia.rest) for creating an extensible API client.
