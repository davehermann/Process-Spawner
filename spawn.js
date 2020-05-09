const { spawn } = require(`child_process`);

/**
 * Spawn a child process
 * @param {(String|Array<String>)} launchString - the entire string to run the process
 * @param {Object} spawnOptions - passed to the NodeJS spawn method
 * @param {Object} [dataOptions={}] - options for this method
 * @param {Boolean} [dataOptions.isBinary] - Format binary output
 * @param {Boolean} [dataOptions.isJson] - Format JSON output
 * @param {Boolean} [dataOptions.consolePassthrough] - send process back to caller. MUST HANDLE "close" event
 * @returns {Promise} Promise will resolve to the type of data [if] supplied, or reject with the error
 */
function spawnChildProcess(launchString, spawnOptions = undefined, dataOptions = {}) {
    return new Promise((resolve, reject) => {
        let content = !!dataOptions && dataOptions.isBinary ? [] : ``,
            errText = ``,
            launching = [];

        if (launchString instanceof Array)
            launching = launchString;
        else {
            let parts = launchString.split(` `),
                partsString = null;

            while (parts.length > 0) {
                let thisPart = parts.shift();

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

        let spawnedProcess = spawn(launching.shift(), launching, spawnOptions);

        if (dataOptions.consolePassthrough) {
            resolve(spawnedProcess);
        } else {
            spawnedProcess.stdout.on(`data`, (data) => {
                if (dataOptions.isBinary)
                    content.push(data);
                else
                    content += data;
            });

            spawnedProcess.stderr.on(`data`, (data) => {
                errText += data;
            });

            spawnedProcess.on(`close`, () => {
                if (!!errText)
                    reject(errText);
                else {
                    if (dataOptions.isBinary)
                        resolve(Buffer.concat(content));
                    else if (dataOptions.isJson)
                        resolve(JSON.parse(content));
                    else
                        resolve(content);
                }
            });
        }
    });
}

module.exports.SpawnProcess = spawnChildProcess;
