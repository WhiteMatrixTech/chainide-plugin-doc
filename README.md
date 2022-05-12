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

下面是一个插件的基本结构，但是由于定义分的太散，以及其他遗留问题，现在很多代码需要复制粘贴，以及chainide本身提供的api不算完整，这部分需要进行一定的调整

```
src
├── chainIDE.d.ts # 通用的chainide定义
├── components # 需要渲染在ide主体中的组件，使用react
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

`packages/chainide/src/modules/extensions/services/manager.ts` 这里的代码会activate对应的插件或者加载内部插件，可以看到主要是通过 `this._extensionEmitter.fire 这块pub/sub` 来更新插件面板，具体细节不在赘述

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

