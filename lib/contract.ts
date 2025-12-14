export const MEMBERSHIP_NFT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_price', type: 'uint256' },
      { internalType: 'bool', name: '_isRecurring', type: 'bool' },
      { internalType: 'uint256', name: '_expiryDuration', type: 'uint256' },
      { internalType: 'string', name: '_metadataURI', type: 'string' },
    ],
    name: 'createMembership',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_membershipId', type: 'uint256' }],
    name: 'purchaseMembership',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_membershipId', type: 'uint256' },
    ],
    name: 'checkAccess',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_membershipId', type: 'uint256' }],
    name: 'getMembership',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'membershipId', type: 'uint256' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'price', type: 'uint256' },
          { internalType: 'bool', name: 'isActive', type: 'bool' },
          { internalType: 'bool', name: 'isRecurring', type: 'bool' },
          { internalType: 'uint256', name: 'expiryDuration', type: 'uint256' },
          { internalType: 'string', name: 'metadataURI', type: 'string' },
          { internalType: 'uint256', name: 'totalMembers', type: 'uint256' },
        ],
        internalType: 'struct MembershipNFT.Membership',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getUserMemberships',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const USDC_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const


