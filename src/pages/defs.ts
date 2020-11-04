export const GAP_BACKGROUND = 50;
export const GAP_CONTENT = 100;

export const enum EPageName {
  HOME = 'HOME',
  CONTACTS = 'CONTACTS',
  EXPERIENCE = 'EXPERIENCE',
}

export const mapPageToRect = {
  [EPageName.HOME]: {
    x: 0,
    y: 0,
    width: 1400,
    height: 800
  },
  [EPageName.CONTACTS]: {
    x: 1600,
    y: 0,
    width: 1400,
    height: 800
  },
  [EPageName.EXPERIENCE]: {
    x: -1600,
    y: 0,
    width: 1400,
    height: 800
  }
};
