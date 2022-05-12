import { Plugin } from './index';

export enum ExtensionEffectActionType {
  LOAD = 'load',
  UNLOAD = 'unload',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate'
}

export interface ExtensionEffectAction {
  type: ExtensionEffectActionType;
  data: Plugin;
}
