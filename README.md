# Project Status

Currently on research. Figuring out the best approach to implement this idea.

This project is now published on NPM. But it is not ready for public use. This projec is not recommended
for any production-level use.

# Directory structure

```
universal-agent/
│── src/                     # Source code
│   ├── agents/              # Different AI agent implementations
│   ├── core/                # Core logic to unify AI agents
│   ├── interfaces/          # TypeScript interfaces for agents
│   ├── adapters/            # Environment adapters (Browser, Shell, Node)
│   ├── utils/               # Utility functions
│   ├── index.ts             # Main library entry point
│── tests/                   # Unit and integration tests
│── examples/                # Example usage in different environments
│── dist/                    # Compiled output (generated by TypeScript, .gitignore'd)
│── config/                  # Configuration files
│── .gitignore               # Git ignore rules
│── .npmignore               # NPM publish ignore rules
│── .eslintrc.js             # Linter configuration
│── .prettierrc              # Prettier configuration
│── package.json             # Project dependencies
│── tsconfig.json            # TypeScript configuration
│── README.md                # Project description and usage
│── LICENSE                  # License for open-source distribution
```
