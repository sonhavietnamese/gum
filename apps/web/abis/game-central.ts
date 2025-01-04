export const ABI = [
  {
    type: 'function',
    name: 'addTeamMember',
    inputs: [
      { name: 'gameId', type: 'uint256', internalType: 'uint256' },
      { name: 'newMember', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [
      { name: 'slug', type: 'string', internalType: 'string' },
      { name: 'title', type: 'string', internalType: 'string' },
      { name: 'team', type: 'address[]', internalType: 'address[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getGame',
    inputs: [{ name: 'gameId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct GameCentral.Game',
        components: [
          { name: 'slug', type: 'string', internalType: 'string' },
          { name: 'title', type: 'string', internalType: 'string' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'team', type: 'address[]', internalType: 'address[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGameByCreator',
    inputs: [{ name: 'creator', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct GameCentral.Game[]',
        components: [
          { name: 'slug', type: 'string', internalType: 'string' },
          { name: 'title', type: 'string', internalType: 'string' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'team', type: 'address[]', internalType: 'address[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGameBySlug',
    inputs: [{ name: 'slug', type: 'string', internalType: 'string' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct GameCentral.Game',
        components: [
          { name: 'slug', type: 'string', internalType: 'string' },
          { name: 'title', type: 'string', internalType: 'string' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'team', type: 'address[]', internalType: 'address[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGames',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct GameCentral.Game[]',
        components: [
          { name: 'slug', type: 'string', internalType: 'string' },
          { name: 'title', type: 'string', internalType: 'string' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'team', type: 'address[]', internalType: 'address[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GameCreated',
    inputs: [
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'title', type: 'string', indexed: false, internalType: 'string' },
      { name: 'team', type: 'address[]', indexed: false, internalType: 'address[]' },
    ],
    anonymous: false,
  },
] as const
