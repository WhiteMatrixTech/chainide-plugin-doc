import { IPluginStorage } from './extensionsStorage';
import { PluginConfigurations, IChainIdeProxyImpl } from './index';
export interface ExtensionProperty {
  active: () => void;
  dispose: () => void;
}

export interface PluginContext {
  subscriptions: ExtensionProperty[];
}

export interface Plugin {
  activate: (ctx: PluginContext, Impl: IChainIdeProxyImpl) => void;
  deactivate: (ctx: PluginContext, Impl: IChainIdeProxyImpl) => void;
  // 动态更新 store
  store: IPluginStorage;
  config: PluginConfigurations;
  context: PluginContext;
}
