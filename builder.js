const commands = require("./commands.json");
const pkg = require("./sample-package.json");
const {exec} = require("./utils.js");
const fs = require("fs");
const path = require("path");
module.exports = class Builder {
    constructor({path, name,original, packages: { dependencies, devDependencies }}) {
        this.path = path;
        this.name = name;
        this.original = original;
        this.dependencies = dependencies;
        this.devDependencies = devDependencies;
    }

    run() {
        process.chdir(this.path);
        const folder = path.join(this.path, this.original);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
        process.chdir(folder);
        pkg.name = this.name;
        const data = JSON.stringify(pkg, null, 4);
        fs.writeFileSync(path.join(folder, "package.json"), data);
        fs.writeFileSync(path.join(folder, "index.js"), "// TODO: Init me!")
        this._runCommands();
        this._addDependencies();
    }

    _runCommand(command) {
        exec(command.cmd, command.args)
    }

    _runCommands() {
        commands.forEach(this._runCommand);
    }

    _addDependencies() {
        this.dependencies.split(" ").forEach(dep => exec("npm", ["install", "--save", dep]));
        this.devDependencies.split(" ").forEach(dep => exec("npm", ["install", "--save-dev", dep]));
    }
}