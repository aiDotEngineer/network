import util from 'util';

function logItems(input: Array<unknown>, prefix = '', depth = 2) {
  for (const item of input) {
    const str = stringify(item, depth);
    if (prefix) {
      console.log(
        str
          .split('\n')
          .map((s) => `${prefix} ${s}`)
          .join('\n'),
      );
    } else {
      console.log(str);
    }
  }
}

export const log = {
  error: (...input: Array<unknown>) => {
    logItems(input);
  },
  warn: (...input: Array<unknown>) => {
    logItems(input);
  },
  debug: (...input: Array<unknown>) => {
    logItems(input, '>>', 10);
  },
};

function stringify(item: unknown, depth: number) {
  // This logic mirrors how Node handles logging to the console.
  // See: https://github.com/nodejs/node/blob/45cdc13/lib/internal/util/inspect.js#L1999
  return typeof item === 'string' ? item : util.inspect(item, { depth });
}
