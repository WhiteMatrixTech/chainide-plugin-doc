### 插件系统的设计

#### 一个插件的声明

activate 是当插件激活的时候调用，其他的也很明确语义化，看字段即可

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



#### 通用目录结构

下面是一个插件的基本结构：

```
src
├── chainIDE.d.ts # 通用的 chainide 定义
├── components # 需要渲染在 ide 主体中的组件，使用 react
│   ├── control.less
│   └── control.tsx
├── extension.ts # 插件声明
└── libs
    ├── index.ts
    ├── types
    │   ├── chainIdeProxyImpl.ts
    │   ├── configuration.ts
    │   ├── contextEffectAction.ts
    │   ├── extensionComponent.ts
    │   ├── extensionEffectAction.ts
    │   ├── extensionsStorage.ts
    │   ├── fileSystem
    │   │   └── IFileSystem.ts
    │   ├── index.ts
    │   ├── plugin.ts
    │   ├── project
    │   │   └── projectPluginsManager.ts
    │   └── wallet.d.ts
    └── utils
        ├── filterPathByRegex.ts
        ├── index.ts
        └── toUri.ts
```

#### 插件在ide中如何被调用

`packages/chainide/src/modules/extensions/services/manager.ts` 这里的代码会 activate 对应的插件或者加载内部插件，可以看到主要是通过 `this._extensionEmitter.fire 这块pub/sub` 来更新插件面板，具体细节不在赘述

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


#### chainide提供的api

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

## 插件系统api

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

使用该 service 可以注册一个命令，在编辑器中使用快捷键 command + p 跳出命令面板，然后执行对应的命令

![image](https://user-images.githubusercontent.com/8351437/168017244-d7bcc906-477c-4e74-a2f6-561ca1da9388.png)

注册命令

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

使用该 service 可以向IDE的 Console 面板注入或者删除数据:

![image](https://user-images.githubusercontent.com/8351437/168017742-6f721ad4-a07a-4a4c-a964-9400cfda24f6.png)

基本使用如下：

```ts
// 添加log
consoleServcie.addLog('INFO', message)
// 监听log变化
consoleService.onConsoleChange(() => {
	// 做一些数据操作
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

这个 service 与 consoleService 比较相似，实在 output 面板中输出信息，使用 onRowsDidChange 检测信息变化，算是比较常用的一个service

#### editorService

这里编辑器 monoca 的相关操作，比如编辑器报错，添加断点等等


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

这个 service 是用来获取文件区域的相关信息，比如获取展开的文件夹，展开文件夹等操作。

基本使用：

```ts
explorerService.expand(projectId, path);
```
