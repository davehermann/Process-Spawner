import { SpawnProcess } from "../dist/spawn";

SpawnProcess([`ls`, `-al`])
    .then(data => {
        // eslint-disable-next-line no-console
        console.log({ data });
    });
