export const DEFAULT_ERROR_MESSAGE = 'Transaction failed! Please try again.';
export enum ContractResponseStatus {
    Success = 'success',
    Failed = 'failed',
}

 export const parseErrorMessage = (error: any): string => {
    if (error?.reason) {
        return error.reason;
    }
    if (error?.error?.message) {
        return error.error.message;
    }
    return DEFAULT_ERROR_MESSAGE;
};