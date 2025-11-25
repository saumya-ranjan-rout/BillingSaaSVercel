"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
let cachedApp = null;
async function handler(req, res) {
    if (!cachedApp) {
        cachedApp = await (0, app_1.createApp)();
    }
    return cachedApp(req, res);
}
exports.default = handler;
//# sourceMappingURL=index.js.map