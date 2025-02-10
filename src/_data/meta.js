export const url = process.env.URL || 'http://localhost:8080';
export const siteName = 'Desert Thunder';
export const siteDescription = 'Home page for Owais Jamil.';
export const siteType = 'Person';
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';

export const author = {
  name: 'Owais Jamil',
  avatar: '/icon-512x512.png',
  email: 'info@stormlightlabs.com',
  website: 'https://desertthunder.dev',
  fediverse: 'https://social.lol/@owais'
};
export const creator = {
  name: 'Owais Jamil',
  email: 'info@stormlightlabs.com',
  website: 'https://desertthunder.github.com',
  social: 'https://bsky.app/profile/@desertthunder.dev'
};

export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg';
export const themeColor = '#dd4462';
export const themeLight = '#f8f8f8';
export const themeDark = '#2e2e2e';
export const opengraph_default = '/assets/images/template/opengraph-default.jpg';
export const opengraph_default_alt = 'Visible content: Home page/personal website of Owais Jamil.';
export const blog = {
  name: 'Writing',
  description: 'A collection of thoughts, notes, and essays.',
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};

export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};

export const dialog = {
  close: 'Close'
};

export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: false
};

export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};

/**
 * See: src/common/greenweb.njk
 *  */
export const greenweb = {
  providers: {
    domain: 'netlify.com',
    service: 'cdn'
  },
  credentials: {
    domain: '',
    doctype: '',
    url: ''
  }
};

export const viewRepo = {
  allow: true,
  infoText: 'View this page on GitHub'
};

export const easteregg = true;
