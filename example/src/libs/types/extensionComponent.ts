export enum ComponentPosition {
  LEFT = 'left',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  CENTER = 'center',
  WELCOME = 'welcome'
}

export interface IBaseExtensionComponent {
  componentId: string;
  position: ComponentPosition;
  componentFunc: () => JSX.Element | JSX.Element[] | null;
}

export interface IControlComponent extends IBaseExtensionComponent {
  position: typeof ComponentPosition.RIGHT;
  name: string;
  iconName: string;
}

export interface IWelcomeComponent extends IBaseExtensionComponent {
  position: typeof ComponentPosition.WELCOME;
}

export interface IBottomComponent extends IBaseExtensionComponent {
  position: typeof ComponentPosition.BOTTOM;
}

export type IAddControlComponent = Omit<IControlComponent, 'position'>;

export type ISetWelcomeComponent = Omit<IWelcomeComponent, 'position'>;

export type ISetBottomComponent = Omit<IBottomComponent, 'position'>;

export type IExtensionComponent =
  | IControlComponent
  | IBottomComponent
  | IWelcomeComponent;
