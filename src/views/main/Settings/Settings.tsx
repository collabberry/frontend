import { Tabs } from '@/components/ui';
import TabContent from '@/components/ui/Tabs/TabContent';
import TabList from '@/components/ui/Tabs/TabList';
import TabNav from '@/components/ui/Tabs/TabNav';
import React from 'react';
import CompensationSettings from './CompensationSettings';
import TeamPointsContractSettings from './TeamPointsContractSettings';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Settings: React.FC = () => {
    const { isAdmin } = useSelector((state: RootState) => state.auth.user);

    return (
        <div>
            <h2 className="text-4xl font-bold mb-4">Settings</h2>
            {isAdmin ? (
                <Tabs defaultValue="tab1" variant="pill">

                    <TabList>
                        <TabNav value="tab1">Compensation</TabNav>
                        <TabNav value="tab2">Team Points Contract</TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="tab1">
                            <CompensationSettings />
                        </TabContent>
                        <TabContent value="tab2">
                            <TeamPointsContractSettings />
                        </TabContent>
                    </div>
                </Tabs>
            ) : (
                <CompensationSettings />
            )}

        </div>
    );
};

export default Settings;