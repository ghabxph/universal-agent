import {
  PathLike,
  Mode,
  MakeDirectoryOptions,
  PathOrFileDescriptor,
  WriteFileOptions,
  RmDirOptions,
} from 'fs'
import { LLM } from '../core/llm.js'

export abstract class Agent {
  public readonly llm: LLM

  public constructor(
    public readonly environment: string,
    public readonly capabilities: string,
  ) {
    this.llm = new LLM('http://localhost:1234')
  }

  /**
   * Returns `undefined`.
   *
   * The `mode` option only affects the newly created file. See {@link open} for more details.
   *
   * For detailed information, see the documentation of the asynchronous version of
   * this API: {@link writeFile}.
   * @since v0.1.29
   * @param file filename or file descriptor
   */
  public abstract writeFileSync(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions,
  ): void

  /**
   * Returns the contents of the `path`.
   *
   * For detailed information, see the documentation of the asynchronous version of
   * this API: {@link readFile}.
   *
   * If the `encoding` option is specified then this function returns a
   * string. Otherwise it returns a buffer.
   *
   * Similar to {@link readFile}, when the path is a directory, the behavior of `fs.readFileSync()` is platform-specific.
   *
   * ```js
   * import { readFileSync } from 'node:fs';
   *
   * // macOS, Linux, and Windows
   * readFileSync('<directory>');
   * // => [Error: EISDIR: illegal operation on a directory, read <directory>]
   *
   * //  FreeBSD
   * readFileSync('<directory>'); // => <data>
   * ```
   * @since v0.1.8
   * @param path filename or file descriptor
   */
  public abstract readFileSync(
    path: PathOrFileDescriptor,
    options?: {
      encoding?: null | undefined
      flag?: string | undefined
    } | null,
  ): Buffer

  /**
   * Synchronous mkdir(2) - create a directory.
   * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
   * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
   * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
   */
  public abstract mkdirSync(
    path: PathLike,
    options?:
      | Mode
      | (MakeDirectoryOptions & {
          recursive?: false | undefined
        })
      | null,
  ): void

  /**
   * Synchronous [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2.html). Returns `undefined`.
   *
   * Using `fs.rmdirSync()` on a file (not a directory) results in an `ENOENT` error
   * on Windows and an `ENOTDIR` error on POSIX.
   *
   * To get a behavior similar to the `rm -rf` Unix command, use {@link rmSync} with options `{ recursive: true, force: true }`.
   * @since v0.1.21
   */
  public abstract rmdirSync(path: PathLike, options?: RmDirOptions): void
}
