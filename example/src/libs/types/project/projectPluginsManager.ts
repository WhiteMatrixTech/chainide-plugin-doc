import { PluginConfigurations } from '..';

export interface ProjectBindPluginsConfig {
  currentProjectId: string | null;
  pluginsConfigs: { [pluginId: string]: PluginConfigurations };
}
