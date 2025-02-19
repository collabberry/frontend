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

export async function apiActivateRounds(data: any) {
  return ApiService.fetchData<any>({
    url: `/rounds/setIsActive`,
    method: "put",
    data,
  });
}

export async function apiGetCurrentRound() {
  return ApiService.fetchData<any>({
    url: `/rounds/current`,
    method: "get",
  });
}

export async function apiGetRounds() {
  return ApiService.fetchData<any>({
    url: `/rounds`,
    method: "get",
  });
}

export async function apiGetRoundById(id: string) {
  return ApiService.fetchData<any>({
    url: `/rounds/${id}`,
    method: "get",
  });
}

export async function apiEditRound(id: string, data: any) {
  return ApiService.fetchData<any>({
    url: `/rounds/${id}`,
    method: "put",
    data
  });
}

export async function apiRemindContributors(roundId: any, data: any) {
  return ApiService.fetchData<any>({
    url: `/rounds/${roundId}/assessments/remind`,
    method: "post",
    data,
  });
}

export async function apiAddAssessment(data: Assessment) {
  return ApiService.fetchData<any>({
    url: `/rounds/assess`,
    method: "post",
    data,
  });
}

export async function apiEditAssessment(assessmentId: string, roundId: string, data: Assessment) {
  return ApiService.fetchData<any>({
    url: `/rounds/${roundId}/assessments/${assessmentId}`,
    method: "put",
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

export async function apiEditContributorAgreement(data: any, agreementId: string) {
  return ApiService.fetchData<any>({
    url: `/orgs/agreement/${agreementId}`,
    method: "put",
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

export async function apiGetMyScores() {
  return ApiService.fetchData<any>({
    url: `/orgs/contributors/myscores`,
    method: "get",
  });
}

export async function apiGetAssessmentsByAssessor(roundId: string, assessorId: string) {
  return ApiService.fetchData<any>({
    url: `/rounds/${roundId}/assessments?assessorId=${assessorId}`,
    method: "get",
  });
}

export async function apiGetAssessmentsByAssessed(roundId: string, assessedId: string) {
  return ApiService.fetchData<any>({
    url: `/rounds/${roundId}/assessments?assessedId=${assessedId}`,
    method: "get",
  });
}

export async function apiAddTxHashToRound(roundId: string, data: any) {
  return ApiService.fetchData<any>({
    url: `/rounds/${roundId}/txHash`,
    method: "post",
    data,
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
