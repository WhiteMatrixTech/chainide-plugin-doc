### Design of the plugin system

#### A plugin declaration

When you activate the plug-in, the activate function is called, and the other terms are also highly semantic; just look at the fields.

```typescript
{
  activate: (ctx) => {},
  command: chainide.registerCommand(ctx: () {}, command: () {}, callback: () {}),
  activate: () => {}
  config: {
    pluginId: 'chainIDE-pluginId',
    version: '0.0.1',
    type: PluginType.view,
    active: true,
    description: {
      title: 'chainIDE-pluginId',
      icon: '#CommentSolid',
      description: 'extensionDescription'
    }
  }
}
```

#### General directory structure

The basic structure of the plugin is as follows:

```
src
├── chainIDE.d.ts # Generic ChainIDE definition
├── components # Components that need to be rendered in the IDE body, use react
│   ├── control.less
│   └── control.tsx
├── extension.ts # Plugin declaration
└── libs
    ├── index.ts
    ├── types
    │   ├── chainIdeProxyImpl.ts
    │   ├── configuration.ts
    │   ├── contextEffectAction.ts
    │   ├── extensionComponent.ts
    │   ├── extensionEffectAction.ts
    │   ├── extensionsStorage.ts
    │   ├── fileSystem
    │   │   └── IFileSystem.ts
    │   ├── index.ts
    │   ├── plugin.ts
    │   ├── project
    │   │   └── projectPluginsManager.ts
    │   └── wallet.d.ts
    └── utils
        ├── filterPathByRegex.ts
        ├── index.ts
        └── toUri.ts
```

#### Plugin calling methond in the IDE

The code in `packages/chainide/src/modules/extensions/services/manager.ts` will activate the corresponding plug-in or load the internal plug-in, you can see that it is mainly through
the `this._extensionEmitter.fire this pub/sub`, to update the plug-in panel, the details will not be repeated.

```ts
activate(pluginId: string) {
    const plugin = this._plugins.get(pluginId);

    if (plugin) {
      this.setConfiguration({ ...plugin.config, active: true });
      this._extensionEmitter.fire({
        type: ExtensionEffectActionType.UPDATE
      });

      plugin.activate(plugin.context, chainIDEProxyImpl);

      plugin.context.subscriptions
        .sort((NItem, OItem) => OItem.priority - NItem.priority)
        .map((item) => item.active());

      plugin.config.active = true;
      this.setPlugin(plugin);

      if (!plugin.config.internalPlugin) {
        updatePluginInfo(
          plugin.config,
          this.currentProjectPlugin?.currentProjectId
        );
      }
    } else {
      outputService.handleErrorSingle(
        getLocaleMsgFromKey('PLUGIN_LOG_PLUGIN_NOT_FOUND', {
          pluginId
        })
      );
    }
  }

```


#### APIs provided by ChainIDE

```ts
interface IChainIdeProxyImpl {
  addControl: (data: IAddControlComponent) => ExtensionProperty;
  setWelcomePage: (data: ISetWelcomeComponent) => ExtensionProperty;
  registerCommand: (data: Omit<ICommand, 'id'>) => ExtensionProperty;
  setWalletView: (
    data: ISetBottomComponent,
    cb?: () => void
  ) => ExtensionProperty;
  registerFunction: (data: IFunction, cb?: () => void) => ExtensionProperty;
  getApiFunction: (name: string) => Function | undefined;
  addModule: (modulename: string, state: any) => void;
  fileSystemService: IFileSystemService;
  currentProject: ProjectBindPluginsConfig;
}

interface IFileSystemService {
  readonly onFilesystemDidChange: Event<IFilesystemChangeEffect>;
  readonly onFileIndex: Event<IFilesystemIndex>;
  readonly onFileContentChange: Event<IFilesystemContentChange>;

  getAllPathByRegex(uri: string, regex: string): Promise<string[]>;

  openSync(uri: string): void;
  closeSync(uri: string): void;
  stat(uri: string): Promise<IStat | null>;
  mkdir(uri: string): Promise<void>;
  getFilesystemIndex(uri: string): Promise<string[]>;
  download(uri: string, filename: string): Promise<void>;
  delete(uri: string): Promise<void>;

  copy(fromUri: string, toUri: string): Promise<string>;
  move(fromUri: string, toUri: string): Promise<string>;
  rename(fromUri: string, name: string): Promise<string>;
  readFile(uri: string): Promise<File | null>;
  writeFile(uri: string, file: File): Promise<void>;
  readFileString(uri: string): Promise<string | null>;
  readSurfaceDirectory(uri: string): Promise<string[] | null>;
  writeFileString(uri: string, content: string): Promise<void>;
  // this content will be cached when create
  createFileString(uri: string, content: string): Promise<void>;
}
```

## Plugin system API

#### commandService

```
interface ICommandService {
  registerCommand(
    data: Omit<ICommand, 'id'> | Array<Omit<ICommand, 'id'>>
  ): ICommand[];
  remove(id: string): ICommand[];
  getCommandsBy(key: string): ICommand[];
  clear(): void;
}
```

Use this service to register a command, exit the command panel in the editor by pressing the shortcut key command + p, and then carry out the registered command.

![image](https://user-images.githubusercontent.com/8351437/168017244-d7bcc906-477c-4e74-a2f6-561ca1da9388.png)

Register command

```ts
chainide.registerCommand({
name: 'test-command',
callback: () => {
	// function will be excuted
}
})
```

#### consoleService

```ts
interface IConsoleService {
  readonly onConsoleChange: Event<ConsoleAction>;

  logs(): IConsole[];
  addLog(type: ConsoleLevel, message: string, detail?: string): void;
  clearLog(): void;
}
```

Use this service to inject or delete data to the console panel of the IDE:

![image](https://user-images.githubusercontent.com/8351437/168017742-6f721ad4-a07a-4a4c-a964-9400cfda24f6.png)

The basic usage is as follows:

```ts
// add log
consoleServcie.addLog('INFO', message)
// monitor log changes
consoleService.onConsoleChange(() => {
	// do some data manipulation
})
```

#### outputService

```ts
interface IOutputService {
  getOutputRows(): IOutputLogRow[];
  getTransactionHash(): string;
  handleInfo(data: IOutputLogRow[]): void;
  handleInfoSingle(msg: string, source?: LogSource): void;
  handleWarn(data: IOutputLogRow[]): void;
  handleWarnSingle(msg: string, source?: LogSource): void;
  handleError(data: IOutputLogRow[]): void;
  handleErrorSingle(msg: string, source?: LogSource): void;
  clearOutput(source: LogSource): void;
  onRowsDidChange: Event<OutputRowsChangeEvent>;
  emitTransactionHash(hash: string): void;
}
```

This service is similar to consoleService.
It outputs information in the output panel and uses onRowsDidChange to detect information changes.
It is a relatively commonly used service.

#### editorService

Here are related operations of the editor monoca, such as editor reporting errors, adding breakpoints, etc.


#### explorerService

```ts
interface IExplorerService {
  getExpandedFolder(projectId: string): IExpandMap;
  expand(projectId: string, path: string): void;
  collapse(projectId: string, path: string): void;
  toggleExpand(projectId: string, path: string): void;
  syncExpandWithFs(projectId: string, indexes: string[]): void;
  clear(projectId: string): void;
  clears(projectIds: string): void;
}
```

This service is used to obtain information about the file area, such as obtaining expanded folders, expanding folders, and other operations.

Basic use:

```ts
explorerService.expand(projectId, path);
```
