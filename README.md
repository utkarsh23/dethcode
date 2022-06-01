<p align="center">
  <br />
  <img src="https://github.com/utkarsh23/stackscode/blob/stacks-viewer/assets/logo.png?raw=true" width="200" alt="">
  <br />
  <h2 align="center">StacksCode</h2>
  <p align="center"><strong>View source of deployed Stacks smart contracts in VS Code</strong></p>
  <p align="center">While on <code>explorer.stacks.co</code>, change <code>stacks</code> to <code>stackscode</code> and browse contracts comfortably in ephemeral VS Code instance</p>
  <p align="center">
    This project is supported by a generous grant from the <a href="https://stacks.org/">Stacks Foundation</a>.<br />You can read more about the grant here: <a href="https://grants.stacks.org/dashboard/grants/349">https://grants.stacks.org/dashboard/grants/349</a>
  </p>
</p>

## Usage

While browsing smart contract code on [Stacks Explorer](https://explorer.stacks.co/) just change the base URL from `.stacks.co` to `.stackscode.co`. This will open Visual Studio Code instance and fetch the verified code using Stacks API.
![Demo](https://github.com/utkarsh23/stackscode/blob/stacks-viewer/assets/demo.gif?raw=true)
## Features ⚡
- Supports mainnet as well as testnet
- Frictionless: tweak the url while browsing the explorer `explorer.stacks.co` -> `explorer.stackscode.co`
- Support for contract name as well as contract deployment transaction ID. For example, BNS can be accessed via `/txid/SP000000000000000000002Q6VF78.bns?chain=mainnet` & `/txid/0xd8a9a4528ae833e1894eee676af8d218f8facbf95e166472df2c1a64219b5dfb?chain=mainnet`

## Motivation
Stacks contracts are open-source by default. All smart contract on Stacks can be viewed from the explorer itself. But the developer experience isn't desirable. To view the contracts referenced via `use-trait` & `impl-trait`, one needs to open these contracts in a separate tab. VS Code offers a great developer experience by allowing users to open files side-by-side, search-within-file & search-across-files, syntax highlighting using your favourite extension etc.

This project was inspired by [github1s](https://github.com/conwnet/github1s) & [DethCode](https://github.com/dethcrypto/dethcode)

## Examples

- Stacks Mainnet:
  [StacksCode](https://explorer.stackscode.co/txid/SP000000000000000000002Q6VF78.bns?chain=mainnet)
  |
  [Stacks Explorer](https://explorer.stacks.co/txid/SP000000000000000000002Q6VF78.bns?chain=mainnet)
- Stacks Testnet:
  [StacksCode](https://explorer.stackscode.co/txid/ST1B4ZCZB59G2YR4TDYNDWP7FWAPTX03AP9KHH2GE.hc-alpha?chain=testnet)
  |
  [Stacks Explorer](https://explorer.stacks.co/txid/ST1B4ZCZB59G2YR4TDYNDWP7FWAPTX03AP9KHH2GE.hc-alpha?chain=testnet)

## Contributing

### Repository structure and package managers

The repository contains two packages, `stacks-viewer` extension and the VSCode compilation meant for hosting it online.

All packages (currently one) except of `@stackscode/stacks-viewer-vscode-host` located in `packages/vscode-host` are managed by `pnpm`. As VSCode depends on Yarn, our `vscode-host` also needs Yarn.

### Step by step instructions

```sh
# You need to create dummy certs using mkcert - https://github.com/FiloSottile/mkcert
cd ./certs
mkcert localhost
mkcert -install
cd ..

# install deps
pnpm install

# install vscode deps
cd packages/vscode-host/
yarn
cd ../../

pnpm build # this builds whole vscode and can take A LOT of time
pnpm serve
```

### Scripts

- **`pnpm install`** - Installs dependencies for the workspace,
  `stacks-viewer` extension, and triggers `yarn install` for `vscode-host`
  through the `postinstall` script.

- **`pnpm build`** - Builds all packages.

- **`pnpm serve`** - Starts HTTP server with `vscode-host`.

### Resources

StacksCode contains a VSCode Web Extension using FileSystemProvider API to show sources of deployed Stacks smart contracts. The following links might be provide some insight, if you're not familiar with some of the aforementioned terms.

- https://code.visualstudio.com/api/extension-guides/web-extensions
- https://code.visualstudio.com/api/references/vscode-api#FileSystemProvider
- https://github.com/microsoft/vscode-extension-samples/blob/main/fsprovider-sample/README.md
