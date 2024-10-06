import ApiService from "./ApiService";
import type {
    OrganizatonData,
} from "@/@types/auth";

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

export async function apiCreateOrganization(data: OrganizatonData) {
    return ApiService.fetchData<any>({
        url: "/orgs",
        method: "post",
        data,
    });
}

export async function apiEditOrganization(data: OrganizatonData) {
    return ApiService.fetchData<any>({
        url: "/orgs",
        method: "put",
        data,
    });
}
