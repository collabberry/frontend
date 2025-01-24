import React, { useEffect, useState } from 'react';
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, Card, FormContainer, FormItem, Input, Spinner, Alert, Switcher, Skeleton, Dialog } from '@/components/ui';
import { useContractService } from '@/services/ContractsService';
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { useSelector } from 'react-redux';
import { RootState } from "@/store";
import SuccessDialog from '@/components/collabberry/custom-components/TransactionSuccessDialog';
import ErrorDialog from '@/components/collabberry/custom-components/TransactionErrorDialog';
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog';
import { ethers } from 'ethers';
import { environment } from '@/api/environment';


const validationSchema = Yup.object().shape({
    isTransferable: Yup.boolean().required("This field is required."),
    isOutsideTransferAllowed: Yup.boolean(),
    materialWeight: Yup.number()
        .required("This field is required.")
        .max(999999999.999, "The material weight must be at most 999999999.999.")
        .test("is-decimal-places", "The material contribution weight cannot have more than 3 decimal places.", value => {
            if (value) {
                const decimalPlaces = value.toString().split('.')[1];
                return !decimalPlaces || decimalPlaces.length <= 3;
            }
            return true;
        })
});

const TeamPointsContractSettings: React.FC = () => {
    const { readSettings, updateConfig, ethersSigner } = useContractService();
    const [loading, setLoading] = useState(false)
    const [dialogLoading, setDialogLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errrorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { network, blockExplorer } = environment;
    const { isAdmin } = useSelector((state: RootState) => state.auth.user);

    const handleDialogClose = () => {
        setDialogVisible(false);
        setTxHash(null);
    };
    const organization = useSelector((state: RootState) => state.auth.org);

    const formik = useFormik({
        initialValues: {
            isTransferable: false,
            isOutsideTransferAllowed: false,
            materialWeight: 0,
        },

        validationSchema,
        onSubmit: async (values) => {

            if (organization?.teamPointsContractAddress) {
                setDialogLoading(true);
                try {
                    const materialWeightWei = ethers.parseUnits(values.materialWeight.toString(), 3);

                    //TODO: Hardcoded value for now, need to change it 
                    const baseTimeWeightWei = ethers.parseUnits('2', 3);
                    const maxTimeScalingWei = ethers.parseUnits('4', 3);
                    const enableTimeScaling = false;
                    // const materialWeightBigInt = BigInt(values.materialWeight);
                    const response = await updateConfig(
                        organization.teamPointsContractAddress,
                        values.isTransferable,
                        values.isOutsideTransferAllowed,
                        materialWeightWei,
                        baseTimeWeightWei,
                        enableTimeScaling,
                        maxTimeScalingWei
                    );

                    if (response?.status === 'success') {
                        setTxHash(response?.event?.transactionHash || '');
                        setDialogLoading(false);
                        setDialogVisible(true);

                    } else {
                        setDialogLoading(false);
                        setErrorDialogVisible(true);
                        setErrorMessage(response?.message || "An error occurred while updating contract settings.");
                    }
                } catch (error: any) {
                    setDialogLoading(false);
                    setErrorDialogVisible(true);
                    setErrorMessage(error?.message || "An error occurred while updating contract settings.");
                }
            }
        }
    });


    useEffect(() => {
        const fetchSettings = async () => {
            if (organization?.teamPointsContractAddress && ethersSigner) {
                setLoading(true);
                const response = await readSettings(organization.teamPointsContractAddress);
                if (response.status === 'success' && response.data) {
                    const { materialWeight } = response.data || {};
                    const humanReadableMaterialWeight = Number(materialWeight) / 1000;
                    formik.setValues({
                        isTransferable: response.data.isTransferable,
                        isOutsideTransferAllowed: response.data.isOutsideTransferAllowed,
                        materialWeight: humanReadableMaterialWeight,
                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                    handleError(response.message || "An error occurred while loading contract settings.");
                }
            }
        };
        fetchSettings();
    }, [organization.teamPointsContractAddress, ethersSigner]);


    return (
        <>
            {isAdmin && (
                <Card className="w-3/4">
                    <SuccessDialog
                        dialogVisible={dialogVisible}
                        txHash={txHash || ''}
                        blockExplorer={blockExplorer}
                        txNetwork={network}
                        dialogMessage="Yay! Your settings have been updated."
                        handleDialogClose={handleDialogClose}>
                    </SuccessDialog>
                    <ErrorDialog dialogVisible={errrorDialogVisible}
                        errorMessage={errorMessage || ''}
                        handleDialogClose={() => setErrorDialogVisible(false)}   >
                    </ErrorDialog>
                    <LoadingDialog dialogVisible={dialogLoading}
                        message={'This might take a while, so please be patient.'}
                        title="Updating Contract Settings..."
                        handleDialogClose={() => null} />

                    <FormContainer>
                        {loading ? (
                            <>
                                <Skeleton height={56} className='form-item' />
                                <Skeleton height={56} className='form-item' />
                                <Skeleton height={56} className='form-item' />
                                <Skeleton height={20} className='mt-4' />
                            </>
                        ) : (
                            <>
                                <>
                                    <FormItem
                                        label="Transferable"
                                        asterisk={true}
                                        errorMessage={formik.errors.isTransferable}
                                        invalid={formik.touched.isTransferable && !!formik.errors.isTransferable}
                                        extraTooltip="If enabled, contributors can transfer their team points to other contributors."

                                    >
                                        <Switcher
                                            name="isTransferable"
                                            defaultChecked={formik.values.isTransferable}
                                            onChange={(value: any) => {
                                                formik.setFieldValue('isTransferable', value);
                                                if (value === false) {
                                                    formik.setFieldValue('isOutsideTransferAllowed', false);
                                                }
                                            }}

                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Transfer Outside Allowed"
                                        errorMessage={formik.errors.isOutsideTransferAllowed}
                                        invalid={formik.touched.isOutsideTransferAllowed && !!formik.errors.isOutsideTransferAllowed}
                                        extraTooltip="If enabled, contributors can transfer their team points to people outside of their organization."
                                    >
                                        <Switcher
                                            name="isOutsideTransferAllowed"
                                            disabled={!formik.values.isTransferable}
                                            checked={formik.values.isOutsideTransferAllowed}
                                            onChange={() => {
                                                formik.setFieldValue('isOutsideTransferAllowed', !formik.values.isOutsideTransferAllowed);
                                            }} />
                                    </FormItem>
                                    <FormItem
                                        label="Material Contribution Multiplier"
                                        asterisk={true}
                                        errorMessage={formik.errors.materialWeight}
                                        invalid={formik.touched.materialWeight && !!formik.errors.materialWeight}
                                        extraTooltip="This is the multiplier used to calculate the team points earned by a contributor based on their material contribution."
                                    >
                                        <Input
                                            type="text"
                                            name="materialWeight"
                                            value={formik.values.materialWeight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched.materialWeight && !!formik.errors.materialWeight}
                                        />
                                    </FormItem>

                                </>
                                <div className='text-sm mt-4 items-center text-gray-500 p-1 flex flex-row justify-end'>
                                    {/* <FiAlertTriangle className='mr-1'/> */}
                                    <p>This transaction will modify contract settings on chain and require gas fees.</p>
                                </div>

                            </>

                        )}
                        <div className="flex justify-end mt-2">
                            <Button
                                type="submit"
                                className="mx-2"
                                onClick={() => formik.handleSubmit()}
                                disabled={!formik.isValid || formik.isSubmitting || loading}
                            >
                                {formik.isSubmitting || loading ? <Spinner /> : "Save"}
                            </Button>
                        </div>


                    </FormContainer>
                </Card>
            )}
        </>

    );
};

export default TeamPointsContractSettings;