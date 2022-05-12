# 🚀 Welcome to your new awesome project!

This project has been created using **webpack scaffold**, you can now run

```
npm run compile
```

to bundle your application

```
npm run start
```

to start your application

### 插件项目结构
src 目录下为主项目目录
extension.ts 为插件入口文件，暴露三个属性
- activate: 插件激活时，触发该函数，函数入参,
 - ctx: 插件内部上下午
 - Impl: 插件接口

- deactivate: 插件注销时，触发该函数
- config: 插件提供基本信息，详见 PluginConfigurations 类型
## API List
### 添加右侧控制栏
```typescript
    const addControls =  Impl.addControl({
        componentFunc: controls,
        name: 'Deploy & Interaction',
        iconName: 'GroupObject',
    })

    ctx.subscriptions.push(addControls)
```

### 设置欢迎页
```typescript
    const setWelcomePage =  Impl.setWelcomePage({
        componentFunc: welcomePage,
        name: 'welcomePage',
        iconName: 'GroupObject',
    })

    ctx.subscriptions.push(setWelcomePage)
```

### 注册命令
```typescript
    const setCommand =  Impl.registerCommand({
        id: 'commandId',
        name: 'command',
        callback: <T>(data?: T) => void,
    })

    ctx.subscriptions.push(setCommand)
```

### 注册方法
```typescript
    const registerFunction =  Impl.registerFunction({
        name: 'functionName',
        function: <T>(data?: T) => void,
    })

    ctx.subscriptions.push(registerFunction)
```