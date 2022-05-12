export enum PluginType {
  view = 'view',
  server = 'server'
}

export interface PluginLoaderOption {
  library: string;
  url: string;
}

export interface PluginLoaderOptionInStore {
  library: string;
  url: string;
}

export interface PluginConfigurations {
  pluginId: string;
  version: string;
  type: PluginType;
  active: boolean;
  libraryInfo?: {
    url: string;
    library: string;
  };
  description: {
    title: string;
    icon?: string;
    description?: string;
  };
}
