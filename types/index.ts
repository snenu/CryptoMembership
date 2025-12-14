export interface Membership {
  _id?: string
  membershipId: number
  creator: string
  name: string
  description: string
  price: number
  isRecurring: boolean
  expiryDuration?: number
  coverImage?: string
  metadataURI?: string
  category?: string
  isActive: boolean
  totalMembers: number
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: string
  walletAddress: string
  username?: string
  bio?: string
  avatar?: string
  isCreator: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Content {
  _id?: string
  membershipId: number
  title: string
  description: string
  contentURI?: string
  contentType: 'text' | 'image' | 'video' | 'file'
  createdAt?: Date
}


