# 🛠️ TypeScript Project (Config Generator Script)

A convenient Node.js script that simplifies the process of managing TypeScript configurations by generating separate configuration files.

## 📦 Install

Install the script as a development dependency using yarn:

```bash
yarn add tsproject --dev
```

Or, if you prefer Npm:

```bash
npm install tsproject --save-dev
```

## 📜 Configuration File

Create a JSON configuration file with the following structure:

```json
{
  "options": {
    "extends": "path/to/base/tsconfig.json",
    "compilerOptions": {
      // ... any compiler options
    },
    "include": [...],
    "exclude": [...]
  },
  "projects": {
    "main": {
      "compilerOptions": {
        // main project-specific compiler options
      },
      "include": [],
      "exclude": [],
      "files": []
    },
    "<dev-project>": {
      ...
    }
    // ... other project configurations
  }
}
```

`projects.main` is mandatory  
Replace <any> with the appropriate path for your TypeScript configuration.

## 🚀 Run

Execute the script with the following command, specifying the path to your configuration file:

```bash
yarn tsproject <tsproject.config>.json
```

Or in a `package.json`

```json
"scripts": {
  "prepare": "tsproject <tsproject.config>.json"
}
```

This will generate individual TypeScript configuration files for each project.

## 📁 Generated Files

The script will generate TypeScript configuration files based on the provided configuration.  
The output files will be named as follows:

The script generates one TypeScript configuration file for each project specified in the "projects" property. The files are named according to the project names, e.g., tsconfig.project1.json, tsconfig.project2..json, etc.

- `tsconfig.json` for the `main` project.
- `tsconfig.<project-name>.json` for other projects.

## 📌 Notes

The script verifies the existence of the "projects" property in the configuration file and displays an error message if it's missing.

TSConfig implemented properties

- [x] extends
- [x] compilerOptions
- [x] include
- [x] exclude
- [x] files

Feel free to reach out for any questions or improvements! 🚀🌈
