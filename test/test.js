"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn_1 = require("../dist/spawn");
spawn_1.SpawnProcess([`ls`, `-al`])
    .then(data => {
    // eslint-disable-next-line no-console
    console.log({ data });
});
