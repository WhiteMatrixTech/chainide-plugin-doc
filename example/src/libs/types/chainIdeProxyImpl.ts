import {
  ExtensionProperty,
  IAddControlComponent,
  ISetBottomComponent,
  ISetWelcomeComponent,
  ProjectBindPluginsConfig
} from '.';
import IFileSystemService from './fileSystem/IFileSystem';

export interface ICommand {
  id: string;
  name: string;
  callback: <T>(data?: T) => void;
}

export interface IFunction {
  name: string;
  function: Function;
}

export interface IChainIdeProxyImpl {
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
