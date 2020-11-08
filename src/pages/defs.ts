export const GAP_BACKGROUND = 50;
export const GAP_CONTENT = 100;

export const enum EPage {
  HOME = 'HOME',
  CONTACTS = 'CONTACTS',
  EXPERIENCE = 'EXPERIENCE',
  ABOUT_SITE = 'ABOUT_SITE',
}

export const mapPageToName = {
  [EPage.HOME]: 'HOME',
  [EPage.CONTACTS]: 'CONTACTS',
  [EPage.EXPERIENCE]: 'EXPERIENCE',
  [EPage.ABOUT_SITE]: 'ABOUT SITE'
};

export const mapPageToRect = {
  [EPage.HOME]: {
    x: 0,
    y: 0,
    width: 1400,
    height: 800
  },
  [EPage.CONTACTS]: {
    x: 1800,
    y: 0,
    width: 1400,
    height: 800
  },
  [EPage.EXPERIENCE]: {
    x: -1800,
    y: 0,
    width: 1400,
    height: 800
  },
  [EPage.ABOUT_SITE]: {
    x: 0,
    y: 1200,
    width: 1400,
    height: 800
  }
};
