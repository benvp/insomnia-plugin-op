import { validateCli, read, GlobalFlags, setGlobalFlags } from '@1password/op-js';
import * as cache from './cache';
import path from 'path';
import fs from 'fs';

type PluginConfig = {
  cliPath?: string;
  flags?: Record<string, any>;
  defaultAccount?: string;
  ttl?: number;
};

const OP_PLUGIN_CONFIG_KEY = '__op_plugin';

const fetchSecretTemplateTag = {
  name: 'op',
  displayName: '1Password => Fetch Secret',
  liveDisplayName: (args: any[]) => {
    console.log(args);
    return `1Password => ${args[0]?.value ?? '--'}${args[1]?.value ? ` (${args[1].value})` : ''}`;
  },
  description: 'Fetch a secret from your 1Password vault',
  args: [
    {
      displayName: 'Reference',
      description: '1Password item reference (op://...)',
      type: 'string',
      defaultValue: '',
      placeholder: "e.g. 'op://vault-name/item-name/section/field'",
    },
    {
      displayName: 'Account',
      description: '1Password account name',
      type: 'string',
      defaultValue: '',
      placeholder: "e.g. 'team-name.1password.com'",
    },
  ],
  async run(context: any, reference: string, account: string) {
    const config = context.context[OP_PLUGIN_CONFIG_KEY] as PluginConfig | undefined;

    console.log(context, reference, account);

    if (config?.flags) {
      setGlobalFlags(config.flags);
    }

    await checkCli(config?.cliPath, config?.ttl);
    const entry = await fetchEntry(reference, account ?? config?.defaultAccount, config?.ttl);

    return entry;
  },
};

async function checkCli(cliPath?: string, ttl?: number) {
  if (cache.opCliInstalled() !== true) {
    try {
      if (cliPath && !fs.existsSync(cliPath)) {
        throw new Error(`The file at path ${cliPath} does not exist.`);
      }

      let pathToAdd = cliPath;
      if (cliPath) {
        const stats = fs.statSync(cliPath);
        if (stats.isFile()) {
          pathToAdd = path.dirname(cliPath);
        }
      }

      // add the CLI to the PATH
      process.env.PATH = pathToAdd ? `${pathToAdd}:${process.env.PATH}` : process.env.PATH;

      await validateCli();

      cache.writeOpCliInstalled(true, ttl);
    } catch (e: any) {
      const error = new Error(
        `There was an issue with the 1Password CLI. If you have the op CLI installed using e.g. Homebrew, please set the '__op_plugin.cliPath' environment variable to the directory containing the 'op' binary. (e.g. /opt/homebrew/bin/op). Error details: ${e.message}`,
      );

      error.stack = e.stack;

      throw error;
    }
  }
}

async function fetchEntry(ref: string, account: string, ttl?: number) {
  const existing = cache.getEntry(ref);

  if (existing) {
    return existing;
  }

  const args: Partial<GlobalFlags> = {};

  if (account) {
    args.account = account;
  }

  const entry = read.parse(ref, args);
  cache.writeEntry(ref, entry, ttl);

  return entry;
}

export const templateTags = [fetchSecretTemplateTag];
