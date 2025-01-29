import { Card } from "@/components/ui";

const TextInfoBlock: React.FC<{ title: string; value: string }> = ({
    title,
    value,
}) => {
    return (
        <div className="flex flex-col">
            <h3 className="text-berrylavender-600 font-bold">{value}</h3>
            <span className="text-sm">{title}</span>
        </div>
    );
};

export const StatisticCard: React.FC<{ title: string; value: string }> = ({
    title,
    value,
}) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm text-gray-500">{title}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-600">
                        {value}
                    </h3>
                </div>
            </div>
        </Card>
    )
}