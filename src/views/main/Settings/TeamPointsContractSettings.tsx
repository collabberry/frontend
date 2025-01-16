import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Card, FormContainer, FormItem, Input, Spinner, Alert, Switcher, Skeleton, Dialog } from '@/components/ui';
import { useDeployTeamPoints } from '@/services/ContractsService';
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { useSelector } from 'react-redux';
import { RootState } from "@/store";
import SuccessDialog from '@/components/collabberry/custom-components/TransactionSuccessDialog';
import ErrorDialog from '@/components/collabberry/custom-components/TransactionErrorDialog';
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog';
import { ethers } from 'ethers';

const validationSchema = Yup.object().shape({
    isTransferable: Yup.boolean().required("This field is required."),
    isOutsideTransferAllowed: Yup.boolean().required("This field is required."),
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
    // .test("is-valid-bigint", "The material weight must be a valid BigInt.", value => {
    //     try {
    //         BigInt(value || 0);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // })
});

const TeamPointsContractSettings: React.FC = () => {
    const { readSettings, updateSettings, ethersSigner } = useDeployTeamPoints();
    const [loading, setLoading] = useState(false)
    const [dialogLoading, setDialogLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errrorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const txBlockExplorer = 'https://arbiscan.io/tx/'
    const txNetwork = 'Arbitrum';

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
                    // const materialWeightBigInt = BigInt(values.materialWeight);
                    const response = await updateSettings(
                        organization.teamPointsContractAddress,
                        values.isTransferable,
                        values.isOutsideTransferAllowed,
                        materialWeightWei
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
        <Card className="w-3/4">
            <SuccessDialog
                dialogVisible={dialogVisible}
                txHash={txHash || ''}
                txBlockExplorer={txBlockExplorer}
                txNetwork={txNetwork}
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
                            >
                                <Switcher
                                    name="isTransferable"
                                    defaultChecked={formik.values.isTransferable}
                                    onChange={(value: any) => formik.setFieldValue('isTransferable', value)}
                                />
                            </FormItem>
                            <FormItem
                                label="Transfer Outside Allowed"
                                asterisk={true}
                                errorMessage={formik.errors.isOutsideTransferAllowed}
                                invalid={formik.touched.isOutsideTransferAllowed && !!formik.errors.isOutsideTransferAllowed}
                            >
                                <Switcher
                                    name="isOutsideTransferAllowed"
                                    defaultChecked={formik.values.isOutsideTransferAllowed}
                                    onChange={(value: any) => formik.setFieldValue('isOutsideTransferAllowed', value)}
                                />
                            </FormItem>
                            <FormItem
                                label="Material Contribution Weight"
                                asterisk={true}
                                errorMessage={formik.errors.materialWeight}
                                invalid={formik.touched.materialWeight && !!formik.errors.materialWeight}
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
    );
};

export default TeamPointsContractSettings;