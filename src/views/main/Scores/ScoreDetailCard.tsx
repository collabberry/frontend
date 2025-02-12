import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import { Avatar, Button, Card, Tooltip } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import placeholderIcon from '@/assets/images/placeholder.jpg';
import { FiEdit } from "react-icons/fi";
import BerryPartialRating from "@/components/collabberry/custom-components/CustomFields/BerryPartialRating";

interface ScoreCardProps {
    title: string;
    score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
    return (
        <Card className="bg-white">
            <h6 className="font-semibold mb-4 text-sm text-gray-500">{title}</h6>
            <div className="flex justify-start items-center gap-2">
                <div>
                    <h1 className="font-bold text-gray-600">
                        {score.toFixed(1)}
                    </h1>
                </div>
                <BerryPartialRating rating={+score?.toFixed(1)} />
            </div>
        </Card>
    );
};



interface ScoreDetailProps {
    contributor: Contributor;
    workScore: number;
    cultureScore: number;
    feedbackPositive: string;
    feedbackNegative: string;
    onEdit?: () => void;
}

export const ScoreDetailCard: React.FC<ScoreDetailProps> = ({
    contributor,
    workScore,
    cultureScore,
    feedbackPositive,
    feedbackNegative,
    onEdit,
}) => {
    return (
        <Card className="p-4 border rounded relative">
            <div className="flex items-center absolute top-5 right-5 m-2 flex gap-2">
                {/* {(workScore === 5 || cultureScore === 5) && (
                    <AnimatedRainbowBerrySvg />

                )} */}
                {onEdit && (
                    <Tooltip title="Edit Assessment">
                        <Button
                            size="sm"
                            shape="circle"
                            icon={<FiEdit />}
                            onClick={onEdit}
                        >
                        </Button>
                    </Tooltip>)}
            </div>


            <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center justify-start min-w-[120px]">
                    <Avatar
                        className="mr-2 rounded-full"
                        src={contributor.profilePicture ?? placeholderIcon}
                    />
                    <span>{contributor.username}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold">Culture Impact</h3>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text-2xl">{cultureScore.toFixed(1)}</p>

                            {cultureScore === 5 && (
                                <AnimatedRainbowBerrySvg width={24} height={24} />
                            )}
                        </div>



                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Work Contribution</h3>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text-2xl">{workScore.toFixed(1)}</p>

                            {workScore === 5 && (
                                <AnimatedRainbowBerrySvg width={24} height={24} />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

                <div className="mt-4">
                    <h3 className="font-semibold text-sm uppercase">Did well</h3>
                    <p className="mt-1">{feedbackPositive || '-'}</p>
                </div>


                <div className="mt-4">
                    <h3 className="font-semibold text-sm uppercase">Could Improve</h3>
                    <p className="mt-1">{feedbackNegative || '-'}</p>
                </div>
            </div>
        </Card>
    );
};