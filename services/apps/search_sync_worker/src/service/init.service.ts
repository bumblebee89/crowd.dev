import { DbStore } from '@crowd/database'
import { Logger, LoggerBase } from '@crowd/logging'
import { OpenSearchService } from './opensearch.service'
import { IDbMemberSyncData } from '@/repo/member.data'
import { MemberSyncService } from './member.sync.service'
import { OpenSearchIndex } from '@/types'
import { IDbActivitySyncData } from '@/repo/activity.data'
import { ActivitySyncService } from './activity.sync.service'

export class InitService extends LoggerBase {
  private readonly fakeTenantId = 'b0e82a13-566f-40e0-b0d0-11fcb6596b0f'
  private readonly fakeSegmentId = 'ce36b0b0-1fc4-4637-955d-afb8a6b58e48'
  private readonly fakeMemberId = '9c19e17c-6a07-4f4c-bc9b-ce1fdce9c126'
  private readonly fakeActivityId = 'fa761640-f77c-4340-b56e-bdd0936d852b'
  private readonly fakeConversationId = 'cba1758c-7b1f-4a3c-b6ff-e6f3bdf54c86'

  constructor(private readonly openSearchService: OpenSearchService, parentLog: Logger) {
    super(parentLog)
  }

  public async initialize(): Promise<void> {
    await this.openSearchService.initialize()
    await this.createFakeMember()
    await this.createFakeActivity()
  }

  private async createFakeMember(): Promise<void> {
    // we need to create a fake member to initialize the index with the proper data
    // it will be created in a nonexisting tenant so no one will see it ever
    // if we don't have anything in the index any search by any field will return an error

    const fakeMember: IDbMemberSyncData = {
      id: this.fakeMemberId,
      tenantId: this.fakeTenantId,
      segmentId: this.fakeSegmentId,
      displayName: 'Test Member',
      emails: ['fake@email.com'],
      score: 10,
      lastEnriched: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      totalReach: 20,
      numberOfOpenSourceContributions: 10,

      activeOn: ['devto'],
      activityCount: 10,
      activityTypes: ['devto:comment'],
      activeDaysCount: 20,
      lastActive: new Date().toISOString(),
      averageSentiment: 20.32,

      identities: [
        {
          platform: 'devto',
          username: 'Test Member',
        },
      ],
      organizations: [
        {
          id: '0dfaa9a0-d95a-4397-958e-4727189e3ef8',
          logo: 'https://placehold.co/400',
          displayName: 'Test Organization',
        },
      ],
      tags: [
        {
          id: 'bced635d-acf7-4b68-a95d-872729e09d58',
          name: 'fake tag',
        },
      ],
      toMergeIds: ['3690742c-c5de-4d9a-aef8-1e3eaf57233d'],
      noMergeIds: ['b176d053-c53e-42d2-88d2-6fbc3e34184c'],

      attributes: {},
    }

    const prepared = MemberSyncService.prefixData(fakeMember, [])
    await this.openSearchService.index(
      `${this.fakeMemberId}-${this.fakeSegmentId}`,
      OpenSearchIndex.MEMBERS,
      prepared,
    )
  }

  private async createFakeActivity(): Promise<void> {
    // we need to create a fake activity to initialize the index with the proper data
    // it will be created in a nonexisting tenant so no one will see it ever
    // if we don't have anything in the index any search by any field will return an error

    const fakeActivity: IDbActivitySyncData = {
      id: this.fakeActivityId,
      tenantId: this.fakeTenantId,
      segmentId: this.fakeSegmentId,
      memberId: this.fakeMemberId,
      type: 'comment',
      timestamp: new Date().toISOString(),
      platform: 'devto',
      isContribution: true,
      score: 10,
      sourceId: '123',
      sourceParentId: '456',
      attributes: {},
      channel: 'channel',
      body: 'body',
      title: 'title',
      url: 'https://placehold.co/400',
      sentiment: 10,
      importHash: 'importHash',
      conversationId: this.fakeConversationId,
      parentId: '6952eace-e083-4c53-a65c-f99848c47c1c',
      username: 'Test Member',
      objectMemberId: '4ea4c0f7-fdf8-448c-99ff-e03d0df95358',
      objectMemberUsername: 'Test Member2',
    }

    const prepared = ActivitySyncService.prefixData(fakeActivity)
    await this.openSearchService.index(this.fakeActivityId, OpenSearchIndex.ACTIVITIES, prepared)
  }
}
