import ApiService from "./ApiService";
import type { OrganizationData } from "@/@types/auth";

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
