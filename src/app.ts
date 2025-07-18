import { validateCli, read, GlobalFlags, setGlobalFlags } from '@1password/op-js';
import * as cache from './cache';
import path from 'path';
import fs from 'fs';

let debounceTimer: NodeJS.Timeout;

type PluginConfig = {
  cliPath?: string;
  flags?: Record<string, any>;
  defaultAccount?: string;
  cacheTTL?: number;
  livePreviewFetchDelay?: number;
  enableLivePreview?: boolean;
};

const OP_PLUGIN_CONFIG_KEY = '__op_plugin';

const fetchSecretTemplateTag = {
  name: 'op',
  displayName: '1Password => Fetch Secret',
  liveDisplayName: (args: any[]) => {
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
    const timeOut = config?.livePreviewFetchDelay || 500;
    const livePreviewEnabled = config?.enableLivePreview !== false;

    // 1. Correctly handle mouse-over and other non-critical renders immediately.
    if (context.renderPurpose !== 'send' && context.renderPurpose !== 'preview') {
      return '****';
    }

    // 2. Handle the live preview with a debounce if config.enableLivePreview is true
    if (context.renderPurpose === 'preview') {
      if (livePreviewEnabled) {
        return new Promise(resolve => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(async () => {
            try {
              if (!reference) {
                return resolve('****');
              }
              const secret = await getSecret(config, reference, account);
              resolve(secret);
            } catch (error: any) {
              // Resolve with the error message so it's visible in the preview.
              resolve(`Error: ${error.message}`);
            }
          }, timeOut);
        });
      } else {
        return '****';
      }
    }

    // 3. If the purpose is 'send', run the fetch immediately.
    return getSecret(config, reference, account);
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

async function fetchEntry(ref: string, account: string) {
  const existing = cache.getEntry(ref);

  if (existing) {
    return existing;
  }

  const args: Partial<GlobalFlags> = {};

  if (account) {
    args.account = account;
  }

  const entry = read.parse(ref, args);
  cache.writeEntry(ref, entry);

  return entry;
}

async function getSecret(config: any, reference: string, account: string) {
  if (config?.flags) {
    setGlobalFlags(config.flags);
  }

  if (typeof config?.cacheTTL === 'number') {
    cache.setStdTTL(config.cacheTTL);
  }

  await checkCli(config?.cliPath);
  const entry = await fetchEntry(reference, account ?? config?.defaultAccount);

  return entry;
}
export const templateTags = [fetchSecretTemplateTag];
