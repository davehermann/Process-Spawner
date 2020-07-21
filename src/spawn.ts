import { spawn } from "child_process";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function spawnChildProcess(launchString: string | Array<string>, spawnOptions: any = undefined, dataOptions: IDataOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const binaryContent: Array<Uint8Array> = [];
        let stringContent = ``,
            errText = ``,
            launching = [];

        if (launchString instanceof Array)
            launching = launchString;
        else {
            const parts = launchString.split(` `);
            let partsString = null;

            while (parts.length > 0) {
                const thisPart = parts.shift();

                if (thisPart.search(/^"/) == 0)
                    partsString = thisPart.substr(1);
                else if (partsString !== null)
                    partsString += ` ${thisPart}`;

                if (partsString === null)
                    launching.push(thisPart);
                else if (partsString.search(/"$/) > 0) {
                    launching.push(partsString.substr(0, partsString.length - 1));
                    partsString = null;
                }
            }
        }

        const spawnedProcess = spawn(launching.shift(), launching, spawnOptions);

        if (dataOptions.consolePassthrough) {
            resolve(spawnedProcess);
        } else {
            spawnedProcess.stdout.on(`data`, (data) => {
                if (dataOptions.isBinary)
                    binaryContent.push(data);
                else
                    stringContent += data;
            });

            spawnedProcess.stderr.on(`data`, (data) => {
                errText += data;
            });

            spawnedProcess.on(`close`, () => {
                if (!!errText)
                    reject(errText);
                else {
                    if (dataOptions.isBinary)
                        resolve(Buffer.concat(binaryContent));
                    else if (dataOptions.isJson)
                        resolve(JSON.parse(stringContent));
                    else
                        resolve(stringContent);
                }
            });
        }
    });
}

export {
    spawnChildProcess as SpawnProcess,
};
