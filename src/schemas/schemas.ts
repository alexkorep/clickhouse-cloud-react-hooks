import { z } from "zod";

// Base response schema that all ClickHouse API responses follow
export const ClickHouseBaseResponseSchema = z.object({
  status: z.number(),
  requestId: z.uuid(),
});

// Error response schema
export const ClickHouseErrorResponseSchema = z.object({
  status: z.number(),
  error: z.string(),
});

// Organization-related schemas
export const OrganizationPrivateEndpointSchema = z.object({
  id: z.string(),
  description: z.string(),
  cloudProvider: z.enum(["gcp", "aws", "azure"]),
  region: z.enum([
    "ap-south-1",
    "ap-southeast-1",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "us-east-1",
    "us-east-2",
    "us-west-2",
    "ap-southeast-2",
    "ap-northeast-1",
    "me-central-1",
    "us-east1",
    "us-central1",
    "europe-west4",
    "asia-southeast1",
    "eastus",
    "eastus2",
    "westus3",
    "germanywestcentral",
  ]),
});

export const ByocConfigSchema = z.object({
  id: z.string(),
  state: z.enum(["infra-ready", "infra-provisioning", "infra-terminated"]),
  accountName: z.string(),
  regionId: z.enum([
    "ap-south-1",
    "ap-southeast-1",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "us-east-1",
    "us-east-2",
    "us-west-2",
    "ap-southeast-2",
    "ap-northeast-1",
    "me-central-1",
    "us-east1",
    "us-central1",
    "europe-west4",
    "asia-southeast1",
    "eastus",
    "eastus2",
    "westus3",
    "germanywestcentral",
  ]),
  cloudProvider: z.enum(["gcp", "aws", "azure"]),
});

export const OrganizationSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  name: z.string(),
  privateEndpoints: z.array(OrganizationPrivateEndpointSchema).default([]),
  byocConfig: z.array(ByocConfigSchema).default([]),
});

// Activity schema
export const ActivitySchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  type: z.enum([
    "create_organization",
    "organization_update_name",
    "transfer_service_in",
    "transfer_service_out",
    "save_payment_method",
    "marketplace_subscription",
    "migrate_marketplace_billing_details_in",
    "migrate_marketplace_billing_details_out",
    "organization_update_tier",
    "organization_invite_create",
    "organization_invite_delete",
    "organization_member_join",
    "organization_member_add",
    "organization_member_leave",
    "organization_member_delete",
    "organization_member_update_role",
    "organization_member_update_mfa_method",
    "key_create",
    "key_delete",
    "openapi_key_update",
    "service_create",
    "service_start",
    "service_stop",
    "service_awaken",
    "service_partially_running",
    "service_delete",
    "service_update_name",
    "service_update_ip_access_list",
    "service_update_autoscaling_memory",
    "service_update_autoscaling_idling",
    "service_update_password",
    "service_update_autoscaling_replicas",
    "service_update_max_allowable_replicas",
    "service_update_backup_configuration",
    "service_restore_backup",
    "service_update_release_channel",
    "service_update_gpt_usage_consent",
    "service_update_private_endpoints",
    "service_import_to_organization",
    "service_export_from_organization",
    "service_maintenance_start",
    "service_maintenance_end",
    "backup_delete",
  ]),
  actorType: z.enum(["user", "support", "system", "api"]),
  actorId: z.string(),
  actorDetails: z.string(),
  actorIpAddress: z.string().optional(),
  organizationId: z.string(),
  serviceId: z.string().optional(),
});

// API Key schemas
export const IpAccessListEntrySchema = z.object({
  source: z.string(),
  description: z.string(),
});

export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  state: z.enum(["enabled", "disabled"]),
  roles: z.array(z.enum(["admin", "developer", "query_endpoints"])),
  keySuffix: z.string(),
  createdAt: z.string().datetime(),
  expireAt: z.string().datetime().nullable().optional(),
  usedAt: z.string().datetime().nullable().optional(),
  ipAccessList: z.array(IpAccessListEntrySchema).default([]),
});

// Usage Cost schemas
export const UsageCostMetricsSchema = z.object({
  storageCHC: z.number().optional(),
  backupCHC: z.number().optional(),
  computeCHC: z.number().optional(),
  dataTransferCHC: z.number().optional(),
  publicDataTransferCHC: z.number().optional(),
  interRegionTier1DataTransferCHC: z.number().optional(),
  interRegionTier2DataTransferCHC: z.number().optional(),
  interRegionTier3DataTransferCHC: z.number().optional(),
  interRegionTier4DataTransferCHC: z.number().optional(),
});

export const UsageCostRecordSchema = z.object({
  dataWarehouseId: z.string().uuid(),
  serviceId: z.string().uuid().nullable(),
  date: z.string().date(),
  entityType: z.enum(["datawarehouse", "service", "clickpipe"]),
  entityId: z.string().uuid(),
  entityName: z.string(),
  metrics: UsageCostMetricsSchema,
  totalCHC: z.number(),
  locked: z.boolean(),
});

export const UsageCostSchema = z.object({
  grandTotalCHC: z.number(),
  costs: UsageCostRecordSchema,
});

// ClickPipe schemas
export const ClickPipeSchema = z
  .object({
    id: z.string().uuid(),
    serviceId: z.string().uuid(),
    name: z.string(),
    state: z.string(),
  })
  .passthrough();

export const ClickPipesResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(ClickPipeSchema),
});

export const ClickPipeResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: ClickPipeSchema,
});

// Private Endpoint Config schemas
export const OrganizationCloudRegionPrivateEndpointConfigSchema = z.object({
  endpointServiceId: z.string(),
});

// Response schemas
export const ApiKeysResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(ApiKeySchema),
});

export const ApiKeyResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: ApiKeySchema,
});

export const ApiKeyCreateResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.object({
    key: ApiKeySchema,
    keyId: z.string().optional(),
    keySecret: z.string().optional(),
  }),
});
export const OrganizationsResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(OrganizationSchema),
});

export const OrganizationResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: OrganizationSchema,
});

export const ActivitiesResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(ActivitySchema),
});

export const ActivityResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: ActivitySchema,
});

export const UsageCostResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: UsageCostSchema,
});

export const PrivateEndpointConfigResponseSchema =
  ClickHouseBaseResponseSchema.extend({
    result: OrganizationCloudRegionPrivateEndpointConfigSchema,
  });

// User management schemas
export const MemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "developer"]),
  joinedAt: z.string().datetime(),
});

export const InvitationSchema = z.object({
  role: z.enum(["admin", "developer"]),
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  expireAt: z.string().datetime(),
});

export const MemberPatchRequestSchema = z.object({
  role: z.enum(["admin", "developer"]),
});

export const InvitationPostRequestSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "developer"]),
});

export const MembersResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(MemberSchema),
});

export const MemberResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: MemberSchema,
});

export const InvitationsResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(InvitationSchema),
});

export const InvitationResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: InvitationSchema,
});

// Type exports
export type Organization = z.infer<typeof OrganizationSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type ApiKey = z.infer<typeof ApiKeySchema>;
export type UsageCost = z.infer<typeof UsageCostSchema>;
export type UsageCostRecord = z.infer<typeof UsageCostRecordSchema>;
export type UsageCostMetrics = z.infer<typeof UsageCostMetricsSchema>;
export type OrganizationPrivateEndpoint = z.infer<
  typeof OrganizationPrivateEndpointSchema
>;
export type ByocConfig = z.infer<typeof ByocConfigSchema>;
export type OrganizationCloudRegionPrivateEndpointConfig = z.infer<
  typeof OrganizationCloudRegionPrivateEndpointConfigSchema
>;
export type ClickPipe = z.infer<typeof ClickPipeSchema>;

// Response types
export type ApiKeysResponse = z.infer<typeof ApiKeysResponseSchema>;
export type ApiKeyResponse = z.infer<typeof ApiKeyResponseSchema>;
export type ApiKeyCreateResponse = z.infer<typeof ApiKeyCreateResponseSchema>;
export type OrganizationsResponse = z.infer<typeof OrganizationsResponseSchema>;
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;
export type ActivitiesResponse = z.infer<typeof ActivitiesResponseSchema>;
export type ActivityResponse = z.infer<typeof ActivityResponseSchema>;
export type UsageCostResponse = z.infer<typeof UsageCostResponseSchema>;
export type PrivateEndpointConfigResponse = z.infer<
  typeof PrivateEndpointConfigResponseSchema
>;
export type ClickHouseErrorResponse = z.infer<
  typeof ClickHouseErrorResponseSchema
>;
export type Member = z.infer<typeof MemberSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type MemberPatchRequest = z.infer<typeof MemberPatchRequestSchema>;
export type InvitationPostRequest = z.infer<
  typeof InvitationPostRequestSchema
>;
export type MembersResponse = z.infer<typeof MembersResponseSchema>;
export type MemberResponse = z.infer<typeof MemberResponseSchema>;
export type InvitationsResponse = z.infer<typeof InvitationsResponseSchema>;
export type InvitationResponse = z.infer<typeof InvitationResponseSchema>;
export type ClickPipesResponse = z.infer<typeof ClickPipesResponseSchema>;
export type ClickPipeResponse = z.infer<typeof ClickPipeResponseSchema>;
export type ClickHouseBaseResponse = z.infer<
  typeof ClickHouseBaseResponseSchema
>;
