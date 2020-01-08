const defaultDir = process.cwd();
const fs = require("fs");
const {exec} = require("./utils.js");
function findPackage(value, package) {
    const data = exec("npm", ["search", "--json", "--no-description", "--parseable", package])
    const parsed = JSON.parse(data);

    const exists = parsed.find(pkg => pkg.name === package);
    if (!exists) {
        value.push(package);
    }
    return value;
}

function validateDependencies(dependencies) {
    const done = this.async();
    const packages = dependencies.replace(" ", "").split(",").filter(pkg => !!pkg);
    
    if (!packages.length) return done("Please enter packages . . .") 
    const invalidPackages = packages.reduce(findPackage, []);
    const errorMessage = `You specified wrong the following packages: ${invalidPackages.join(", ")}`;
    return invalidPackages.length ? done(errorMessage) : done(null, true);
}

function isEmpty(text) {
    return !text.trim().replace(" ").length ? "It cannot be blank" : false;
}

function exists(text) {
    const done = this.async();
    const empty = isEmpty(text);
    return empty ? done(empty) : !fs.existsSync(text) ? done("Folder doesn't exist") : done(null, true); 
}

module.exports = {
    "core": [
        {
            "prefix": ">",
            "type": "input",
            "name": "path",
            "message": "Input project path, defaults to current directory: ",
            "default": defaultDir,
            "validate": exists
        },
        {
            "prefix": ">",
            "type": "input",
            "name": "name",
            "message": "Input project name: ",
            "default": "Empty project",
            "filter": (txt) => txt.replace(" ", "").length ? txt : "Empty project"
        },
        {
            "prefix": ">",
            "type": "confirm",
            "name": "dependencies",
            "message": "Are there any dependencies? ",
            "default": false
        },
        {
            "prefix": ">",
            "type": "confirm",
            "name": "devDependencies",
            "message": "Are there any development dependencies? ",
            "default": false
        }
    ],
    "dependencies": {
        "normal": {
            "prefix": ">",
            "type": "input",
            "name": "normal",
            "message": "Input dependencies separated by comma: ",
            "validate": validateDependencies
        },
        "dev": {
            "prefix": ">",
            "type": "input",
            "name": "dev",
            "message": "Input development dependencies separated by comma: ",
            "validate": validateDependencies
        }
    }
}