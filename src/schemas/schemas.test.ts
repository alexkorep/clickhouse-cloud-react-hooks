import { describe, it, expect } from 'vitest';
import { 
  OrganizationSchema, 
  OrganizationsResponseSchema,
  ActivitySchema,
  UsageCostSchema,
  ClickHouseErrorResponseSchema
} from './schemas';

describe('ClickHouse Schemas', () => {
  describe('OrganizationSchema', () => {
    it('should validate a valid organization object', () => {
      const validOrganization = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: '2024-01-01T00:00:00Z',
        name: 'Test Organization',
        privateEndpoints: [],
        byocConfig: []
      };

      const result = OrganizationSchema.safeParse(validOrganization);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid organization object', () => {
      const invalidOrganization = {
        id: 'invalid-uuid',
        createdAt: 'invalid-date',
        name: 123, // should be string
        privateEndpoints: 'not-an-array',
        byocConfig: []
      };

      const result = OrganizationSchema.safeParse(invalidOrganization);
      expect(result.success).toBe(false);
    });
  });

  describe('OrganizationsResponseSchema', () => {
    it('should validate a valid API response', () => {
      const validResponse = {
        status: 200,
        requestId: '550e8400-e29b-41d4-a716-446655440000',
        result: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            createdAt: '2024-01-01T00:00:00Z',
            name: 'Test Organization',
            privateEndpoints: [],
            byocConfig: []
          }
        ]
      };

      const result = OrganizationsResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('ActivitySchema', () => {
    it('should validate a valid activity object', () => {
      const validActivity = {
        id: 'activity-123',
        createdAt: '2024-01-01T00:00:00Z',
        type: 'service_create',
        actorType: 'user',
        actorId: 'user-123',
        actorDetails: 'User created a service',
        organizationId: 'org-123'
      };

      const result = ActivitySchema.safeParse(validActivity);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid activity type', () => {
      const invalidActivity = {
        id: 'activity-123',
        createdAt: '2024-01-01T00:00:00Z',
        type: 'invalid_activity_type',
        actorType: 'user',
        actorId: 'user-123',
        actorDetails: 'User created a service',
        organizationId: 'org-123'
      };

      const result = ActivitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
    });
  });

  describe('UsageCostSchema', () => {
    it('should validate a valid usage cost object', () => {
      const validUsageCost = {
        grandTotalCHC: 100.50,
        costs: {
          dataWarehouseId: '550e8400-e29b-41d4-a716-446655440000',
          serviceId: '550e8400-e29b-41d4-a716-446655440001',
          date: '2024-01-01',
          entityType: 'service',
          entityId: '550e8400-e29b-41d4-a716-446655440002',
          entityName: 'Test Service',
          metrics: {
            computeCHC: 50.25,
            storageCHC: 25.15,
            backupCHC: 15.10
          },
          totalCHC: 90.50,
          locked: true
        }
      };

      const result = UsageCostSchema.safeParse(validUsageCost);
      expect(result.success).toBe(true);
    });
  });

  describe('ClickHouseErrorResponseSchema', () => {
    it('should validate a valid error response', () => {
      const validErrorResponse = {
        status: 400,
        error: 'Bad request: invalid parameters'
      };

      const result = ClickHouseErrorResponseSchema.safeParse(validErrorResponse);
      expect(result.success).toBe(true);
    });
  });
});
