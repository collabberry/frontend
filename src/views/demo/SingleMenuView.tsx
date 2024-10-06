import Card from "@/components/ui/Card";
import { apiCreateOrganization, apiGetOrganizationById, apiEditOrganization, apiGetInvitationToken, apiGetContributorAgreement, apiCreateContributorAgreement } from "@/services/OrgService";

const SingleMenuView = () => {
    const mockData = {
        name: "The Moth Umbrella Corporation",
        logo: "https://picsum.photos/300",
    };
    const mockEditOrgdata = {
        id: "66fd82230be1e66a5bfe5478",
        name: "The Moth Umbrella Corp",
        par: 20,
        cycle: 3,
        startDate: "2024-10-04T00:00:00.000Z",
    };

    const registerOrganization = async () => {
        try {
            const response = await apiCreateOrganization(mockData);
        } catch (error) {
            console.error("Error registering org:", error);
        }
    };

    const getOrganizationById = async () => {
        try {
            const response = await apiGetOrganizationById('66fd82230be1e66a5bfe5478');
        } catch (error) {
            console.error("Error retrieving org:", error);
        }
    };

    const editOrganization = async () => {
        try {
            const response = await apiEditOrganization(mockEditOrgdata);
        } catch (error) {
            console.error("Error updating org:", error);
        }
    };

    const getInvitationToken = async (email: string) => {
        try {
            const response = await apiGetInvitationToken();
        } catch (error) {
            console.error("Error retrieving invitation token:", error);
        }
    };

    const getContributorAgreement = async () => {
        const contributorId = "66fd81c90be1e66a5bfe5471";
        try {
            const response = await apiGetContributorAgreement(contributorId);
        } catch (error) {
            console.error("Error retrieving contributor agreement:", error);
        }
    };

    const createContributorAgreement = async () => {
        const agreementData = {
            userId: "66fd81c90be1e66a5bfe5471",
            roleName: "Lead",
            responsibilities: "Lead the project",
            marketRate: 5000,
            fiatRequested: 2000,
            commitment: 90,
        };

        const agreementId = '66fd84db0be1e66a5bfe548d'
        try {
            const response = await apiCreateContributorAgreement(agreementData);
            console.log("Contributor agreement created successfully:", response);
        } catch (error) {
            console.error("Error creating contributor agreement:", error);
        }
    };

    return (
        <div className="flex flex-col items-center h-screen">
            <Card
                className="relative z-10 min-w-[320px] max-w-[640px] md:min-w-[600px] md:max-w-[900px] mt-4"
                bodyClass="md:p-10 flex flex-col gap-4 items-center"
            >
                <button
                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={getOrganizationById}
                >
                    Get Organization By ID
                </button>
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={registerOrganization}
                >
                    Register Organization
                </button>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={editOrganization}
                >
                    Edit Organization
                </button>
                <button
                    className="bg-purple-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={() => getInvitationToken("example@example.com")}
                >
                    Get Invitation Token
                </button>
                <button
                    className="bg-orange-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={createContributorAgreement}
                >
                    Create Contributor Agreement
                </button>
                <button
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
                    onClick={getContributorAgreement}
                >
                    Get Contributor Agreement
                </button>
            </Card>
        </div>
    );
}

export default SingleMenuView
