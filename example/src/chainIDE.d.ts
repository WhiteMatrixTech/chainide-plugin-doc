import { IChainIdeProxyImpl } from './libs/types/chainIdeProxyImpl';

declare module 'chainIDE' {
  export let chainIDEProxyImpl: IChainIdeProxyImpl;
}
