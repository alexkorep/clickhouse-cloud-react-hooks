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

// Backup schemas
export const BackupConfigurationSchema = z.object({
  backupPeriodInHours: z.number().optional(),
  backupRetentionPeriodInHours: z.number().optional(),
  backupStartTime: z.string().optional(),
});

export const BackupSchema = z.object({
  id: z.string(),
  status: z.enum(["done", "error", "in_progress"]),
  serviceId: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().optional(),
  sizeInBytes: z.number().optional(),
  durationInSeconds: z.number().optional(),
  type: z.enum(["full", "incremental"]),
  backupName: z.string().optional(),
  bucket: z.any().optional(),
});

export const BackupsResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(BackupSchema),
});

export const BackupResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: BackupSchema,
});

export const BackupConfigurationResponseSchema =
  ClickHouseBaseResponseSchema.extend({
    result: BackupConfigurationSchema,
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

// Service Schemas
export const ServiceEndpointSchema = z.object({
  host: z.string(),
  port: z.number(),
  protocol: z.string(),
});

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tier: z.enum(["development", "production"]),
  region: z.string(),
  provider: z.string(),
  state: z.enum([
    "creating",
    "running",
    "stopped",
    "deleting",
    "restarting",
    "error",
    "partially_running",
    "awaking",
    "stopping",
  ]),
  idle_scaling_down_time_seconds: z.number().optional(),
  release_channel: z.enum(["stable", "lts"]),
  version: z.string(),
  max_replicas: z.number(),
  min_replicas: z.number(),
  replicas: z.number(),
  endpoints: z.array(ServiceEndpointSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_used_at: z.string().datetime(),
  ip_access: z.array(IpAccessListEntrySchema),
  private_endpoint_config: z.any().optional(),
  query_endpoint_config: z.any().optional(),
  backup_config: BackupConfigurationSchema.optional(),
  byoc_config_id: z.string().uuid().optional(),
  gpt_usage_consent: z.boolean().optional(),
});

export const ServicesResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: z.array(ServiceSchema),
});

export const ServiceResponseSchema = ClickHouseBaseResponseSchema.extend({
  result: ServiceSchema,
});

// Private Endpoint Config schemas
export const OrganizationCloudRegionPrivateEndpointConfigSchema = z.object({
  endpointServiceId: z.string(),
});

// Reverse Private Endpoint schemas
export const CreateReversePrivateEndpointSchema = z.object({
  description: z.string(),
  type: z.enum(["VPC_ENDPOINT_SERVICE", "VPC_RESOURCE", "MSK_MULTI_VPC"]),
  vpcEndpointServiceName: z.string().nullable().optional(),
  vpcResourceConfigurationId: z.string().nullable().optional(),
  vpcResourceShareArn: z.string().nullable().optional(),
  mskClusterArn: z.string().nullable().optional(),
  mskAuthentication: z
    .enum(["SASL_IAM", "SASL_SCRAM"])
    .nullable()
    .optional(),
});

export const ReversePrivateEndpointSchema = z.object({
  description: z.string(),
  type: z.enum(["VPC_ENDPOINT_SERVICE", "VPC_RESOURCE", "MSK_MULTI_VPC"]),
  vpcEndpointServiceName: z.string().nullable(),
  vpcResourceConfigurationId: z.string().nullable(),
  vpcResourceShareArn: z.string().nullable(),
  mskClusterArn: z.string().nullable(),
  mskAuthentication: z.enum(["SASL_IAM", "SASL_SCRAM"]).nullable(),
  id: z.string().uuid(),
  serviceId: z.string().uuid(),
  endpointId: z.string(),
  dnsNames: z.array(z.string()),
  privateDnsNames: z.array(z.string()),
  status: z.enum([
    "Unknown",
    "Provisioning",
    "Deleting",
    "Ready",
    "Failed",
    "PendingAcceptance",
    "Rejected",
    "Expired",
  ]),
});

export const ReversePrivateEndpointsResponseSchema =
  ClickHouseBaseResponseSchema.extend({
    result: z.array(ReversePrivateEndpointSchema),
  });

export const ReversePrivateEndpointResponseSchema =
  ClickHouseBaseResponseSchema.extend({
    result: ReversePrivateEndpointSchema,
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
export type BackupConfiguration = z.infer<typeof BackupConfigurationSchema>;
export type Backup = z.infer<typeof BackupSchema>;
export type CreateReversePrivateEndpoint = z.infer<
  typeof CreateReversePrivateEndpointSchema
>;
export type ReversePrivateEndpoint = z.infer<
  typeof ReversePrivateEndpointSchema
>;
export type Member = z.infer<typeof MemberSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type MemberPatchRequest = z.infer<typeof MemberPatchRequestSchema>;
export type InvitationPostRequest = z.infer<
  typeof InvitationPostRequestSchema
>;
export type Service = z.infer<typeof ServiceSchema>;

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
export type BackupsResponse = z.infer<typeof BackupsResponseSchema>;
export type BackupResponse = z.infer<typeof BackupResponseSchema>;
export type BackupConfigurationResponse = z.infer<
  typeof BackupConfigurationResponseSchema
>;
export type ClickHouseErrorResponse = z.infer<
  typeof ClickHouseErrorResponseSchema
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
export type ReversePrivateEndpointsResponse = z.infer<
  typeof ReversePrivateEndpointsResponseSchema
>;
export type ReversePrivateEndpointResponse = z.infer<
  typeof ReversePrivateEndpointResponseSchema
>;
export type ServicesResponse = z.infer<typeof ServicesResponseSchema>;
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>;
