const { spawnSync } = require('child_process');

module.exports = {
    exec: (cmd, opts) => {
        const data = spawnSync(cmd, opts);
        return data.stdout.toString();
    }
}