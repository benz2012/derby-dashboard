const teams = [
  {
    TeamId: 111115,
    Name: 'Ladies in Blue',
    Organization: 'Alpha Xi Delta',
    OrganizationId: 'Delta Lambda',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/15977225_1210599155682729_7133893204754799897_n.jpg?oh=2109b5ef25457f30bffbb7e274aa908b&oe=5AAE2CDE',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/20992928_1417436408332335_7717137204795591914_n.jpg?oh=840947d5f08cdb58143d742eb278c954&oe=5A85C016',
  },
  {
    TeamId: 111116,
    Name: 'Ladies in Red',
    Organization: 'Alpha Sigma Alpha',
    OrganizationId: 'Gamma Iota',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/15894847_1766748363351498_8389639838058692877_n.jpg?oh=af6012472f41d51decccb61166856189&oe=5AAE9F6F',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/16991961_1834646776561656_4581931833239378068_o.jpg?oh=e5a7b4d156b7dfcedf6110154889f435&oe=5AAE146E',
  },
  {
    TeamId: 111117,
    Name: 'Ladies in Gold',
    Organization: 'Delta Phi Epsilon',
    OrganizationId: 'Beta Upsilon',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/14993395_1523893317627208_2220904083202448227_n.jpg?oh=df97fff612ef0e9b9f8e10887562325a&oe=5A8528C6',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19577444_1803237849692752_2742238223574804621_o.jpg?oh=f7e7ce0adae379e1a58aaec0502f87ec&oe=5A841868',
  },
  {
    TeamId: 111118,
    Name: 'Ladies in Grey',
    Organization: 'Zeta Tau Alpha',
    OrganizationId: 'Iota Psi',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16298714_10155058800994797_320135251807191447_n.jpg?oh=92ccc3f8b94cf46bb1296deb446ca2c7&oe=5A644C29',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/13697103_10154417752359797_7824310842252206267_n.jpg?oh=7460ad21c57b99abd7d5326fa5e40360&oe=5A79FC61',
  },
  {
    TeamId: 111119,
    Name: 'Ladies in Purple',
    Organization: 'Sigma Sigma Sigma',
    OrganizationId: 'Epsilon Psi',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/19511291_1471873526204709_3405939982259809593_n.png?oh=927d89ff3c0bebbf90f9b854aff14d54&oe=5A718A0C',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/21728974_1540996869292374_4527059636847351927_o.jpg?oh=cbe30018999303d183b0c9ab7124940d&oe=5A68F552',
  },
]

const raised = [
  { 111115: { raised: 2000, external: {} } },
  { 111116: { raised: 1450, external: {} } },
  { 111117: { raised: 850, external: {} } },
  { 111118: { raised: 450, external: {} } },
  { 111119: { raised: 1600, external: {} } },
]

module.exports = {
  teams,
  raised,
}
