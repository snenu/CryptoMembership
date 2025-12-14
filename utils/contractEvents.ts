import { parseEventLogs, type TransactionReceipt } from 'viem'
import { MEMBERSHIP_NFT_ABI } from '@/lib/contract'

export function parseMembershipCreatedEvent(receipt: TransactionReceipt): number | null {
  try {
    const logs = parseEventLogs({
      abi: MEMBERSHIP_NFT_ABI,
      logs: receipt.logs,
    }) as any[]

    const createdEvent = logs.find(
      (log: any) => log.eventName === 'MembershipCreated'
    )

    if (createdEvent && createdEvent.args) {
      return Number(createdEvent.args.membershipId)
    }
  } catch (error) {
    console.error('Error parsing events:', error)
  }
  return null
}

