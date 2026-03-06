import Dexie, { type Table } from 'dexie'
import type { Character } from '@/types/character'
import type { Campaign } from '@/types/campaign'
import type { AdversaryTemplate } from '@/types/adversary'
import type { Encounter } from '@/types/combat'

export class CosmereCampaignDB extends Dexie {
  characters!: Table<Character>
  campaigns!: Table<Campaign>
  adversaries!: Table<AdversaryTemplate>
  encounters!: Table<Encounter>

  constructor() {
    super('CosmereCampaignDB')
    this.version(1).stores({
      characters: 'id, updatedAt, name, ancestry',
      campaigns: 'id, updatedAt',
      adversaries: 'id, tier, role, updatedAt, *tags',
      encounters: 'id, campaignId, isActive',
    })
  }
}

export const db = new CosmereCampaignDB()
