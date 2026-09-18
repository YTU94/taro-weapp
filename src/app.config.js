export default defineAppConfig({
  pages: [
    'pages/tabBar/index/index',
    'pages/tabBar/share/index',
    'pages/flopGame/index',
    'pages/pukeGame/index',
    'pages/rotateGame/index',
    'pages/diceGame/index',
    'pages/twentyFourGame/index'
  ],
  tabBar: {
    custom: false,
    color: '#333333',
    selectedColor: '#6190E8',
    backgroundColor: '#fff',
    list: [
      {
        iconPath: './assets/images/game-default.png',
        selectedIconPath: './assets/images/game-active.png',
        pagePath: 'pages/tabBar/index/index',
        text: '首页'
      },
      {
        iconPath: './assets/images/share-default.png',
        selectedIconPath: './assets/images/share-active.png',
        pagePath: 'pages/tabBar/share/index',
        text: '分享'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  navigateToMiniProgramAppIdList: ['wx18a2ac992306a5a4']
})

