import ApiService from "./ApiService";
import type { Assessment, OrganizationData } from "@/@types/auth";

export async function apiGetInvitationToken() {
  return ApiService.fetchData<any>({
    url: "/orgs/invitation",
    method: "get",
  });
}

export async function apiGetContributorAgreement(contributorId: string) {
  return ApiService.fetchData<any>({
    url: `/orgs/contributors/${contributorId}/agreements`,
    method: "get",
  });
}

export async function apiActivateRounds(orgId: string, data: any) {
  return ApiService.fetchData<any>({
    url: `/orgs/${orgId}/rounds/setIsActive`,
    method: "put",
    data,
  });
}

export async function apiGetCurrentRound(orgId: string) {
  return ApiService.fetchData<any>({
    url: `/orgs/${orgId}/rounds/current`,
    method: "get",
  });
}

export async function apiAddAssessment(data: Assessment) {
  return ApiService.fetchData<any>({
    url: `/orgs/rounds/assess`,
    method: "post",
    data,
  });
}

export async function apiCreateContributorAgreement(data: any) {
  return ApiService.fetchData<any>({
    url: `/orgs/agreement`,
    method: "post",
    data,
  });
}

export async function apiGetOrganizationById(id: string) {
  return ApiService.fetchData<any>({
    url: `/orgs/${id}`,
    method: "get",
  });
}

export async function apiCreateOrganization(data: OrganizationData) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, (data as any)[key]);
  });

  return ApiService.fetchData<any>({
    url: "/orgs",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function apiEditOrganization(data: OrganizationData) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, (data as any)[key]);
  });

  return ApiService.fetchData<any>({
    url: "/orgs",
    method: "put",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
