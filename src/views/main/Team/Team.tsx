import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { Contributor } from "@/models/Organization.model";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setInvitationToken } from "@/store";
import { useState } from "react";
import OrganizationCard from "./OrganizationCard";
import { Button, Dialog, Tag, Tooltip } from "@/components/ui";
import { useLocation, useNavigate } from "react-router-dom";
import EditOrganizationForm from "./EditOrganization";
import AddAgreementForm from "./AddAgreement";
import ViewAgreement from "./ViewAgreement";
import {
  apiGetInvitationToken,
} from "@/services/OrgService";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import InvitationLink from "../Dashboard/InvitationDialog";
import { useDialog } from "@/services/DialogService";
import { FiEdit, FiEye, FiPieChart, FiUsers } from "react-icons/fi";
import { useAdminContractService } from "@/services/AdminContractService";
import { refreshOrganizationData } from "@/services/LoadAndDispatchService";
import { useHandleError } from "@/services/HandleError";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { ethers } from "ethers";
import { Chart } from "@/components/shared";
import { COLORS, CUSTOM_COLORS } from "@/constants/chart.constant";
import { useContractService } from "@/services/ContractsService";

interface ChartData {
  labels: string[];
  series: number[];
}

const Team: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const user = useSelector((state: RootState) => state.auth.user);
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const invitationToken = useSelector(
    (state: RootState) => state.auth.invite.invitationToken
  );
  const { checkAdminContributors } = useAdminContractService();
  const handleError = useHandleError();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
  const { isOpen: isInviteDialogOpen, openDialog: openInviteDialog, closeDialog: closeInviteDialog } = useDialog();
  const { isOpen: isAgreementDialogOpen, openDialog: openAgreementDialog, closeDialog: closeAgreementDialog } = useDialog();
  const { isOpen: isViewAgreementDialogOpen, openDialog: openViewAgreementDialog, closeDialog: closeViewAgreementDialog } = useDialog();
  const { isOpen: isEditAgreementDialogOpen, openDialog: openEditAgreementDialog, closeDialog: closeEditAgreementDialog } = useDialog();
  const [totalSupply, setTotalSupply] = useState(0);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    series: [],
  });
  const fromDashboard = location.state && location.state.from === "dashboard";
  const [loading, setLoading] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [contributorsWithAdminFlag, setContributorsWithAdminFlag] = useState<Contributor[]>([]);
  const { fetchTotalSupply, ethersSigner } = useContractService();



  useEffect(() => {
    const fetchAdminContributors = async () => {
      setLoading(true);
      if (organization?.contributors && organization?.teamPointsContractAddress) {
        try {
          const response = await checkAdminContributors(organization?.teamPointsContractAddress, organization?.contributors || []);
          const admins = response.data.adminContributors;
          const contributorsWithBalance = response.data.contributorsStatusAndBalance;
          const labels = contributorsWithBalance.map((contributor: any) => contributor.username);
          const series = contributorsWithBalance.map((contributor: any) =>
            Math.floor(Number(ethers.formatUnits(contributor.balance, 'ether'))) || 0
          );

          const seriesPercentage = contributorsWithBalance.map((contributor: any) =>
            (((Math.floor(Number(ethers.formatUnits(contributor.balance, 'ether'))) || 0) / totalSupply) * 100) || 0
          );
          setChartData({ labels, series: seriesPercentage });
          // setChartData({ labels, series });
          if (response.status === 'success') {
            const adminContributorsWithBalance = organization?.contributors.map((contributor) => {
              const isContractAdmin = admins.some((admin: Contributor) => admin.walletAddress === contributor.walletAddress);
              const contributorWithBalance = contributorsWithBalance.find((c: Contributor) => c.walletAddress === contributor.walletAddress);
              return { ...contributor, isContractAdmin, balance: Math.floor(Number(ethers.formatUnits(contributorWithBalance?.balance, 'ether'))) || 0 };
            });

            setContributorsWithAdminFlag(adminContributorsWithBalance);
          }
        } catch (error) {
          console.error("Failed to fetch admin contributors", error);
        } finally {
          setLoading(false);
        }

      }
    };
    fetchAdminContributors();
  }, [organization]);

  const inviteAction = async () => {
    if (!invitationToken) {
      try {
        const response = await apiGetInvitationToken();
        if (response.data) {
          dispatch(setInvitationToken(response.data));
        }
        openInviteDialog();
      } catch (error: any) {
        handleError(error);
      }
    } else {
      openInviteDialog();
    }
  };

  const goToAdminManagement = () => {
    navigate("/admins");
  };

  const goToManualAllocation = () => {
    navigate("/manual-allocation");
  }

  const goToMaterialContribution = () => {
    navigate("/material-contribution");
  }


  useEffect(() => {
    const fetchOrganization = async () => {
      const orgId = user?.organization?.id
      refreshOrganizationData(orgId, dispatch, handleError);
    };
    fetchOrganization();
  }, [])


  useEffect(() => {
    const fetchSupply = async () => {
      if (organization?.teamPointsContractAddress && ethersSigner) {
        setLoading(true);
        const response = await fetchTotalSupply(organization?.teamPointsContractAddress);
        if (response.status === 'success' && response.data) {
          const { totalSupply } = response.data;
          const formattedTotalSupply = totalSupply ? Math.floor(Number(ethers.formatUnits(totalSupply, 'ether'))) : 0;
          setTotalSupply(formattedTotalSupply);
          setLoading(false);
        } else {
          setLoading(false);

        }
      }
    }
    fetchSupply();
  }, [organization.teamPointsContractAddress, ethersSigner]);

  const viewAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openViewAgreementDialog();
    }
  };

  const editAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openEditAgreementDialog();
    }
  };

  const addAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openAgreementDialog();
    }
  };


  const columns: ColumnDef<Contributor>[] = [
    {
      header: "Member",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;


        return (
          <CustomAvatarAndUsername
            imageUrl={data?.profilePicture}
            userName={value}
            isContractAdmin={data?.isContractAdmin}
          />
        );
      },
    },
    {
      header: "Commitment",
      accessorKey: "agreement.commitment",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value}%</span> : null;
      },
    },
    {
      header: "Market Rate",
      accessorKey: "agreement.marketRate",
      cell: (props) => {
        const value = props.getValue() as number;

        if (value) {
          return (
            <span>
              $
              {Number(props.getValue() as number).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          );
        }
      },
    },
    {
      header: "Monetary Compensation",
      accessorKey: "agreement.fiatRequested",
      cell: (props) => {
        const value = props.getValue() as number;
        if (value) {
          return (
            <span>
              $
              {Number(props.getValue() as number).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          );
        }
      },
    },
    {
      header: "TP Balance",
      cell: (props) => {
        const data = props.row.original as any;
        const value = data.balance;

        return (
          <span>
            {`${Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`}

          </span>
        );

      },
    },
    {
      header: "TP Percentage",
      accessorKey: "balance",
      cell: (props) => {
        const value = props.getValue() as number;
        return (
          <span>
            {totalSupply === 0 ? "0%" : `${((value / totalSupply) * 100).toFixed(2)}%`}
          </span>
        );
      },
    },
    {
      header: "Role Name",
      accessorKey: "agreement.roleName",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return value ? <div className="flex flex-col">
          <div>{value}</div>
          <div>
            {data?.isContractAdmin && <Tag className="bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100 rounded-md border-0 p-1">Admin</Tag>
            }
          </div>

        </div> : null;
      }
    },
    // {
    //   header: "Team Points",
    //   accessorKey: "agreement.teamPoints",
    // },
    // {
    //   header: "Team Points",
    //   accessorKey: "agreement.teamPointsShare",
    //   cell: (props) => {
    //     const value = props.getValue() as number;
    //     return value ? <span>{value}%</span> : null;
    //   },
    // },
    {
      header: "Agreement",
      accessorKey: "agreement",
      id: "agreement",
      sortingFn: (rowA, rowB, columnId) => {
        const agreementA = rowA.original.agreement;
        const agreementB = rowB.original.agreement;
        const isEmptyA = !agreementA || Object.keys(agreementA).length === 0;
        const isEmptyB = !agreementB || Object.keys(agreementB).length === 0;
        return isEmptyA === isEmptyB ? 0 : isEmptyA ? -1 : 1;
      },
      cell: (props) => {
        const contributor = props.row.original;
        const agreement = contributor?.agreement;
        return (
          <div>
            {agreement && Object.keys(agreement).length > 0 ? (
              <div className="flex items-center gap-1">
                <Tooltip title="View Agreement">
                  <Button
                    size="sm"
                    shape="circle"
                    icon={<FiEye />}
                    onClick={() => viewAgreement(contributor)}
                  >
                  </Button>
                </Tooltip>

                {
                  isAdmin && (
                    <Tooltip title="Edit Agreement">
                      <Button
                        size="sm"
                        shape="circle"
                        icon={<FiEdit />}
                        onClick={() => editAgreement(contributor)}
                      >
                      </Button>
                    </Tooltip>
                  )
                }
              </div>


            ) : isAdmin ? (
              <Button size="sm" onClick={() => addAgreement(contributor)}>
                Add Agreement
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];






  return (
    <>
      {isEditDialogOpen && (
        <Dialog isOpen={isEditDialogOpen} onClose={closeEditDialog}>
          <EditOrganizationForm
            initialData={organization}
            onSubmit={closeEditDialog}
          />
        </Dialog>
      )}
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={closeInviteDialog}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}
      {isAgreementDialogOpen && (
        <Dialog
          isOpen={isAgreementDialogOpen}
          onClose={closeAgreementDialog}
          width={600}
        >
          <AddAgreementForm
            contributor={selectedContributor}
            handleClose={closeAgreementDialog}
          />
        </Dialog>
      )}

      {isEditAgreementDialogOpen && (
        <Dialog
          isOpen={isEditAgreementDialogOpen}
          onClose={closeEditAgreementDialog}
          width={600}
        >
          <AddAgreementForm
            contributor={selectedContributor}
            handleClose={closeEditAgreementDialog}
          />
        </Dialog>
      )}

      {isViewAgreementDialogOpen && (
        <Dialog
          width={600}
          isOpen={isViewAgreementDialogOpen}
          onClose={closeViewAgreementDialog}
        >
          <ViewAgreement
            contributor={selectedContributor}
            handleClose={closeViewAgreementDialog}
          />
        </Dialog>
      )}
      <div className="mb-4">
        <h1>Team</h1>
      </div>

      <div className="mb-4 flex justify-between items-start md:items-end flex-col md:flex-row gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row gap-2">
          <OrganizationCard
            organization={organization}
            onEdit={openEditDialog}
            onInvite={inviteAction}
            isAdmin={isAdmin as boolean}
          />
          {chartData.labels.length && chartData.series.length && (
            <Chart
              className="flex"
              // customOptions={{ colors: CUSTOM_COLORS, labels: chartData.labels, chart: { offsetX: 0, offsetY: 0, }, plotOptions: { pie: { donut: { size: '60%', labels: { total: { label: '', } } } } }, responsive: [{ breakpoint: 480, options: { chart: { width: 150, height: 150, }, legend: { position: 'bottom', }, }, },], }}
              customOptions={{
                colors: CUSTOM_COLORS,
                labels: chartData.labels,
                chart: {
                  offsetX: 0,
                  offsetY: 0,
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '60%',
                      labels: {
                        total: {
                          label: '',
                        }
                      }
                    }
                  }
                },
                // Add the formatting options here
                tooltip: {
                  y: {
                    formatter: (value: number) => `${value.toFixed(2)}%`
                  }
                },
                // dataLabels: {
                //   formatter: (val: number) => `${val.toFixed(2)}%`
                // },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 150,
                        height: 150,
                      },
                      legend: {
                        position: 'bottom',
                      },
                    },
                  },
                ],
              }}
              series={chartData.series}
              height={125}
              width={125}
              type="donut"
              donutText="TP" />
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2 flex-row mx-2">

            <Tooltip title="Admin Management">
              <Button size="sm"
                color="berrylavender"
                variant="twoTone"
                shape="circle" onClick={goToAdminManagement} icon={<FiUsers />} >
              </Button>
            </Tooltip>
            <Tooltip title="Manual Allocation">
              <Button size="sm"
                color="berrylavender"
                variant="twoTone"
                shape="circle" onClick={goToManualAllocation} icon={<FiPieChart />} >

              </Button>
            </Tooltip>
            <Tooltip title="Material Contribution">
              <Button size="sm"
                color="berrylavender"
                variant="twoTone"
                shape="circle" onClick={goToMaterialContribution} icon={<RiMoneyDollarCircleLine />} >

              </Button>
            </Tooltip>



          </div>



        )}

      </div>
      <div>
        <CustomTableWithSorting
          data={contributorsWithAdminFlag || []}
          columns={columns}
          initialSort={
            fromDashboard
              ? [{ id: "agreement", desc: false, }]
              : [{ id: "agreement", desc: true }]
          }
        />
      </div>
    </>
  );
};

export default Team;
