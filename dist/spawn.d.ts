/** Options for the data output */
interface IDataOptions {
    /** Format binary output */
    isBinary?: boolean;
    /** Format JSON output */
    isJson?: boolean;
    /**
     * Send process back to caller.
     *   - **MUST HANDLE *close* event**
     */
    consolePassthrough?: boolean;
}
/**
 * Spawn a child process
 * @param launchString - the entire string to run the process
 * @param spawnOptions - passed to the NodeJS spawn method
 * @param dataOptions - options for this method
 */
declare function spawnChildProcess(launchString: string | Array<string>, spawnOptions?: any, dataOptions?: IDataOptions): Promise<unknown>;
export { spawnChildProcess as SpawnProcess, };
