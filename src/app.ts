import { validateCli, read } from '@1password/op-js';
import * as cache from './cache';
import path from 'path';
import fs from 'fs';

type PluginConfig = {
  cliPath?: string;
};

const OP_PLUGIN_CONFIG_KEY = '__op_plugin';

const fetchSecretTemplateTag = {
  name: 'op',
  displayName: '1Password => Fetch Secret',
  liveDisplayName: (args: any[]) => {
    return `1Password => ${args[0]?.value ?? '--'}`;
  },
  description: 'Fetch a secret from your 1Password vault',
  args: [
    {
      displayName: 'Reference',
      description: '1Password item reference (op://...)',
      type: 'string',
      defaultValue: '',
      placeholder: "e.g. 'op://team-name.1password.com/vault-name/item-name'",
    },
  ],
  async run(context: any, reference: string) {
    const config = context.context[OP_PLUGIN_CONFIG_KEY] as PluginConfig | undefined;

    await checkCli(config?.cliPath);
    const entry = await fetchEntry(reference);

    return entry;
  },
};

async function checkCli(cliPath?: string) {
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

      cache.writeOpCliInstalled(true);
    } catch (e: any) {
      const error = new Error(
        `There was an issue with the 1Password CLI. If you have the op CLI installed using e.g. Homebrew, please set the '__op_plugin.cliPath' environment variable to the directory containing the 'op' binary. (e.g. /opt/homebrew/bin/op). Error details: ${e.message}`,
      );

      error.stack = e.stack;

      throw error;
    }
  }
}

async function fetchEntry(ref: string) {
  const existing = cache.getEntry(ref);

  if (existing) {
    return existing;
  }

  const entry = read.parse(ref);
  cache.writeEntry(ref, entry);

  return entry;
}

export const templateTags = [fetchSecretTemplateTag];
