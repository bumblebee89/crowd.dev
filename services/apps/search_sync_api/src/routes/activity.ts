import express from 'express'
import { ActivitySyncService, OpenSearchService } from '@crowd/opensearch'
import { ApiRequest } from '../middleware/index'
import { asyncWrap } from 'middleware/error'

const router = express.Router()

router.post(
  '/sync/activities',
  asyncWrap(async (req: ApiRequest, res) => {
    const openSearchService = new OpenSearchService(req.log)
    const activitySyncService = new ActivitySyncService(req.dbStore, openSearchService, req.log)
    const { activityIds } = req.body
    try {
      await activitySyncService.syncActivities(activityIds)
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }),
)

router.post(
  '/sync/tenant/activities',
  asyncWrap(async (req: ApiRequest, res) => {
    const openSearchService = new OpenSearchService(req.log)
    const activitySyncService = new ActivitySyncService(req.dbStore, openSearchService, req.log)

    const { tenantId } = req.body
    try {
      await activitySyncService.syncTenantActivities(tenantId)
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }),
)

router.post(
  '/sync/organization/activities',
  asyncWrap(async (req: ApiRequest, res) => {
    const openSearchService = new OpenSearchService(req.log)
    const activitySyncService = new ActivitySyncService(req.dbStore, openSearchService, req.log)

    const { organizationId } = req.body
    try {
      await activitySyncService.syncOrganizationActivities(organizationId)
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }),
)

router.delete(
  '/cleanup/tenant/activities',
  asyncWrap(async (req: ApiRequest, res) => {
    const openSearchService = new OpenSearchService(req.log)
    const activitySyncService = new ActivitySyncService(req.dbStore, openSearchService, req.log)

    const { tenantId } = req.body
    try {
      await activitySyncService.cleanupActivityIndex(tenantId)
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }),
)

router.delete(
  '/cleanup/activities',
  asyncWrap(async (req: ApiRequest, res) => {
    const openSearchService = new OpenSearchService(req.log)
    const activitySyncService = new ActivitySyncService(req.dbStore, openSearchService, req.log)

    const { activityId } = req.body
    try {
      await activitySyncService.cleanupActivityIndex(activityId)
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }),
)

export default router
