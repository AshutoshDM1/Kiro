# How to Publish Kiro CLI to NPM

Follow these steps to make Kiro available for anyone to install via `npm install -g kiro`.

## 1. Prepare your `package.json`
Ensure your `package.json` has the correct fields:
- `name`: Should be `kiro` (if available) or a scoped name like `@yourusername/kiro`.
- `version`: Start with `1.0.0`.
- `bin`: Points to the compiled entry point.
- `files`: Include the `dist` folder.

```json
{
  "name": "kiro-solana-cli",
  "version": "1.0.0",
  "description": "AI-powered Solana CLI agent",
  "main": "dist/index.js",
  "bin": {
    "kiro": "dist/index.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build"
  }
}
```

## 2. Compile the Project
Kiro uses `tsup` for bundling. Run the build command to generate the `dist` folder.

```bash
pnpm build
```

## 3. NPM Login
If you haven't already, log in to your NPM account:

```bash
npm login
```

## 4. Publish
Run the publish command. If using a scoped name (e.g., `@user/kiro`), use the `--access public` flag.

```bash
npm publish --access public
```

## 5. Usage
Now users can install Kiro globally:

```bash
npm install -g kiro-solana-cli
kiro
```

---

## 💡 Tips for CLI Publishing
- **Shebang**: Ensure `src/index.ts` (or the compiled output) starts with `#!/usr/bin/env node`.
- **Package Size**: Keep it small by only including necessary files.
- **Readme**: A good README with screenshots/GIFs makes a huge difference!
