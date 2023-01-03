# 🚀 Quick Start

Use the commands below to access this project's webpack package:

```
// compile plugin
npm run compile
```

```
// local start
npm run start
```

### Plugin project structure
The main project directory extension.ts in the src directory is the plug-in entry file, which exposes three attributes
- activate: When the plug-in is activated, the function is triggered, and the function enters parameters,
- ctx: Plugin internal context
- Impl: Plugin interface
- deactivate: This function is triggered when the plugin logs out
- config: The plugin provides basic information, see PluginConfigurations type for details

## API List
### Add right control bar
```typescript
    const addControls =  Impl.addControl({
        componentFunc: controls,
        name: 'Deploy & Interaction',
        iconName: 'GroupObject',
    })

    ctx.subscriptions.push(addControls)
```

### Set up welcome page
```typescript
    const setWelcomePage =  Impl.setWelcomePage({
        componentFunc: welcomePage,
        name: 'welcomePage',
        iconName: 'GroupObject',
    })

    ctx.subscriptions.push(setWelcomePage)
```

### Register command
```typescript
    const setCommand =  Impl.registerCommand({
        id: 'commandId',
        name: 'command',
        callback: <T>(data?: T) => void,
    })

    ctx.subscriptions.push(setCommand)
```

### Registration method
```typescript
    const registerFunction =  Impl.registerFunction({
        name: 'functionName',
        function: <T>(data?: T) => void,
    })

    ctx.subscriptions.push(registerFunction)
```
