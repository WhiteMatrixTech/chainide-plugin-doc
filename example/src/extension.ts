import { PluginConfigurations, PluginContext, PluginType } from './libs';
import { Controls } from './components/control';
import * as chainIDE from 'chainIDE';

const { chainIDEProxyImpl } = chainIDE;

console.log('chainIDEProxyImpl', chainIDEProxyImpl);

export function activate(ctx: PluginContext) {
  const addControl = chainIDEProxyImpl.addControl({
    componentId: 'sample-component-id',
    componentFunc: Controls,
    name: 'right control',
    iconName: 'GroupObject'
  });

  const command = chainIDEProxyImpl.registerCommand({
    name: 'chainIDE-pluginId.testCommand',
    callback: () => {
      alert('test command');
    }
  });

  const registerFunc = chainIDEProxyImpl.registerFunction({
    name: 'chainIDE-pluginId.testFunction',
    function: () => {
      console.log('register function');
    }
  });

  ctx.subscriptions.push(addControl, command, registerFunc);
}

export function deactivate(_ctx: PluginContext) {
  console.log('deactivate plugin');
}

export const config: PluginConfigurations = {
  pluginId: 'chainIDE-pluginId',
  version: '0.0.1',
  type: PluginType.view,
  active: true,
  description: {
    title: 'chainIDE-pluginId',
    icon: '#CommentSolid',
    description: 'extensionDescription'
  }
};
