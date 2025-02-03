import { Agent } from '../../agent.js'
import {
  PathLike,
  Mode,
  MakeDirectoryOptions,
  PathOrFileDescriptor,
  WriteFileOptions,
  RmDirOptions,
} from 'fs'

export class BrowserAgent extends Agent {
  public constructor(environment?: string) {
    if (environment === undefined) {
      super('Unknown browser', 'None at the moment.')
    } else super(environment, 'None at the moment.')
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public writeFileSync(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions,
  ): void {
    throw new Error('Not implemented')
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public readFileSync(
    path: PathOrFileDescriptor,
    options?: {
      encoding?: null | undefined
      flag?: string | undefined
    } | null,
  ): Buffer {
    throw new Error('Not implemented')
  }

  /**
   * Synchronous mkdir(2) - create a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
   * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
   */
  public mkdirSync(
    path: PathLike,
    options?:
      | Mode
      | (MakeDirectoryOptions & {
          recursive?: false | undefined
        })
      | null,
  ): void {
    throw new Error('Not implemented')
  }

  /**
   * Synchronous [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2.html). Returns `undefined`.
   *
   * Using `fs.rmdirSync()` on a file (not a directory) results in an `ENOENT` error
   * on Windows and an `ENOTDIR` error on POSIX.
   *
   * To get a behavior similar to the `rm -rf` Unix command, use {@link rmSync} with options `{ recursive: true, force: true }`.
   * @since v0.1.21
   */
  public rmdirSync(path: PathLike, options?: RmDirOptions): void {
    throw new Error('Not implemented')
  }
}
