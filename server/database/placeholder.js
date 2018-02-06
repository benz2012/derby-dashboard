const teams = [
  {
    TeamId: 111115,
    Name: 'Ladies in Blue',
    Organization: 'Alpha Xi Delta',
    OrganizationId: 'Delta Lambda',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-1/p200x200/15977225_1210599155682729_7133893204754799897_n.jpg?oh=2109b5ef25457f30bffbb7e274aa908b&oe=5AAE2CDE',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/20992928_1417436408332335_7717137204795591914_n.jpg?oh=840947d5f08cdb58143d742eb278c954&oe=5A85C016',
    URL: 'https://us-p2p.netdonor.net/223/derby-challenge/954/',
  },
  {
    TeamId: 111118,
    Name: 'Ladies in Grey',
    Organization: 'Zeta Tau Alpha',
    OrganizationId: 'Iota Psi',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/16298714_10155058800994797_320135251807191447_n.jpg?oh=9125e7ebd04be8ae4d525cc670495283&oe=5B2520AE',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/13697103_10154417752359797_7824310842252206267_n.jpg?oh=7460ad21c57b99abd7d5326fa5e40360&oe=5A79FC61',
    URL: 'https://us-p2p.netdonor.net/223/derby-challenge/954/',
  },
  {
    TeamId: 111119,
    Name: 'Ladies in Purple',
    Organization: 'Sigma Sigma Sigma',
    OrganizationId: 'Epsilon Psi',
    AvatarURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/19511291_1471873526204709_3405939982259809593_n.png?oh=1c7dadb7d004a228b6c12c89b6f4fe22&oe=5AEA928B',
    CoverURL: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/13406767_1218684024818246_6520316270310595527_n.jpg?oh=0ab0b68b0970429f405adf9b1ab81e5f&oe=5B24EC3F',
    URL: 'https://us-p2p.netdonor.net/223/derby-challenge/954/',
  },
]

const raised = [
  { id: 111115, raised: 2376, external: {} },
  { id: 111118, raised: 557, external: {} },
  { id: 111119, raised: 2467, external: { 10: 1000 } },
]

module.exports = {
  teams,
  raised,
}
