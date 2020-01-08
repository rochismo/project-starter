#!/usr/bin/env node

const inquirer = require("inquirer");
const questions = require("./questions.js");
const Builder = require("./builder.js");
const objects = {
    dependencies: "",
    devDependencies: ""
};

inquirer.prompt(questions["core"]).then(async data => {
    data.path = !data.path.trim() ? process.cwd() : data.path;
    data.name = !data.name.trim() ? "Empty project" : data.name;
    data.original = data.name;
    data.name = data.name.trim().toLowerCase().replace(" ", "-");

    const {path, name, dependencies, devDependencies} = data;
    if (dependencies) {
        const _dependencies = await inquirer.prompt(questions.dependencies.normal);
        objects.dependencies = _dependencies.normal.replace(" ", "").replace(",", " ");
    }

    if (devDependencies) {
        const _dependencies = await inquirer.prompt(questions.dependencies.dev);
        objects.devDependencies = _dependencies.dev.replace(" ", "").replace(",", " ");
    }
    const builder = new Builder({path, name, original: data.original, packages: objects})
    builder.run();
})  