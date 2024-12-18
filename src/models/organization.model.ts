export interface Agreement {
    marketRate?: number;
    roleName?: string;
    responsibilities?: string;
    fiatRequested?: number;
    commitment?: number;
}

export interface Contributor {
    id: string;
    walletAddress: string;
    username: string;
    agreement?: Agreement;
    profilePicture?: string;
}

export interface Organization {
    name: string;
    id: string;
    roles?: number[];
    agreement?: Agreement;
    par?: number;
    logo?: string;
    compensationPeriod?: number;
    compensationStartDay?: string;
    assessmentStartDelayInDays?: number;
    assessmentDurationInDays?: number;
    nextRoundDate?: string;
    contributors?: Contributor[];
}
