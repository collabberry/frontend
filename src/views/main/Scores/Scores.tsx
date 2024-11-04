import { RoundStatus } from '@/components/collabberry/utils/collabberry-constants';
import { RootState, setAllRounds, setSelectedRound } from '@/store';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import CustomTableWithSorting from '@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting';

const Scores: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentRound, selectedRound, allRounds } = useSelector(
      (state: RootState) => state.auth.rounds
    );
  
    //TODO: Change once there is a round id
    React.useEffect(() => {
      if (!allRounds || (allRounds.length === 0 && currentRound)) {
        dispatch(setAllRounds([currentRound]));
      }
    }, [allRounds, currentRound]);
  
    const seeMyScores = (round: any) => {
      dispatch(setSelectedRound(round));
      navigate("my-scores");
    };
  
    const columns: ColumnDef<any>[] = [
      {
        header: "Round",
        cell: (props) => {
          //TODO: Change once there is a round id
          const data = props.row.original;
          const value = props.getValue() as string;
          return <span>{"Round 1"}</span>;
        },
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        cell: (props) => {
          const value = props.getValue() as number;
          const formattedDate = new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          return formattedDate ? <span>{formattedDate}</span> : null;
        },
      },
      {
        header: "End Date",
        accessorKey: "endDate",
        cell: (props) => {
          const value = props.getValue() as number;
          const formattedDate = new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          return formattedDate ? <span>{formattedDate}</span> : null;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (props) => {
          const value = props.getValue() as number;
  
          const statusString = (() => {
            switch (value) {
              case RoundStatus.NotStarted:
                return "Not Started";
              case RoundStatus.InProgress:
                return "In Progress";
              case RoundStatus.Completed:
                return "Completed";
              default:
                return "Unknown";
            }
          })();
          return <span>{statusString}</span>;
          {
          }
        },
      },
      // {
      //   header: "Team Points",
      //   accessorKey: "teamPoints",
      // },
  
      {
        header: "See My Scores",
        id: "round",
        cell: (props) => {
          const round = props.row.original;
          return (
            <div>
              {round ? (
                <Button size="sm" variant="plain" onClick={() => seeMyScores(round)}>
                  See My Scores
                </Button>
              ) : null}
            </div>
          );
        },
      },
    ];
  
    return (
      <div>
        <h1>Rounds</h1>
        <div className="mt-4">
          <CustomTableWithSorting data={allRounds || []} columns={columns} />
        </div>
      </div>
    );
  };

export default Scores;