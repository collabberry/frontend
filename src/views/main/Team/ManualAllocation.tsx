
import { RootState } from '@/store';
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikProps, getIn } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Card, FormContainer, FormItem, Input, InputGroup } from '@/components/ui';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { ethers } from 'ethers';
import CustomAvatarAndUsername from '@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername';
import PlaceholderAvatarAndUsername from '@/components/collabberry/custom-components/CustomRainbowKit/PlaceholderAvatarAndUsername';
import { useContractService } from '@/services/ContractsService';
import { environment } from '@/api/environment';
import SuccessDialog from '@/components/collabberry/custom-components/TransactionSuccessDialog';
import ErrorDialog from '@/components/collabberry/custom-components/TransactionErrorDialog';
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog';
import { handleError } from '@/components/collabberry/helpers/ToastNotifications';
import Addon from '@/components/ui/InputGroup/Addon';

type FormModel = {
    contributors: {
        walletAddress: string
        amount: number
    }[]
}

const validationSchema = Yup.object().shape({
    contributors: Yup.array().of(
        Yup.object().shape({
            walletAddress: Yup.string()
                .test('is-valid-eth-address', 'Invalid wallet address', value => ethers.isAddress(value))
                .test('is-unique', 'Wallet address must be unique', function (value) {
                    const { options } = this;
                    const contribitors = options.context?.contributors || [];
                    return contribitors.filter((contributor: any) => contributor?.walletAddress === value).length === 1;
                }),

            amount: Yup.number().min(1, 'Amount must be at least 1').required('Amount is required')
        })
    )
});

const fieldFeedback = (form: FormikProps<FormModel>, name: string) => {
    const error = getIn(form.errors, name)
    const touch = getIn(form.touched, name)
    return {
        errorMessage: error || '',
        invalid: typeof touch === 'undefined' ? false : error && touch,
    }
}

const ManualAllocation: React.FC = () => {
    const organization = useSelector((state: RootState) => state.auth.org);
    const { isAdmin } = useSelector((state: RootState) => state.auth.user);
    const { manualAllocation, ethersSigner } = useContractService();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errrorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { network, blockExplorer } = environment;

    const handleDialogClose = () => {
        setDialogVisible(false);
        setTxHash(null);
    };

    const initialValues = {
        contributors: organization?.contributors?.map((contributor: any) => ({
            walletAddress: contributor.walletAddress,
            amount: ""
        })) || []
    }

    const onSubmit = async (values: any) => {
        console.log(values, 'values');

        const recipients = values.contributors.map((contributor: { walletAddress: any; }) => contributor.walletAddress);
        const amounts = values.contributors.map((contributor: { amount: any; }) => contributor.amount);

        if (organization?.teamPointsContractAddress && recipients.length > 0 && amounts.length > 0 && recipients.length === amounts.length) {
            try {
                setLoading(true);
                const response = await manualAllocation(
                    organization?.teamPointsContractAddress,
                    recipients,
                    amounts
                );

                if (response?.status === 'success') {
                    setTxHash(response?.data?.transactionHash || '');
                    setLoading(false);
                    setDialogVisible(true);
                } else {
                    setLoading(false);
                    setErrorDialogVisible(true);
                    setErrorMessage(response?.message || "An error occurred while minting the tokens.");
                }
            } catch (error: any) {
                setLoading(false);
                setErrorDialogVisible(true);
                setErrorMessage(error?.message || "An error occurred while minting the tokens.");
            }
        }



    }

    return (
        <>

            {isAdmin && (
                <>
                    <h1>Manual Allocation</h1>
                    <SuccessDialog
                        dialogVisible={dialogVisible}
                        txHash={txHash || ''}
                        blockExplorer={blockExplorer}
                        txNetwork={network}
                        dialogMessage="Yay! The tokens have been minted successfully."
                        handleDialogClose={handleDialogClose}>
                    </SuccessDialog>
                    <ErrorDialog dialogVisible={errrorDialogVisible}
                        errorMessage={errorMessage || ''}
                        handleDialogClose={() => setErrorDialogVisible(false)}   >
                    </ErrorDialog>
                    <LoadingDialog dialogVisible={loading}
                        message={'You will be promped to sign a transaction. This might take a while, so please be patient.'}
                        title="Minting Tokens..."
                        handleDialogClose={() => null}   >
                    </LoadingDialog>
                    <Card className="w-3/4 mt-4">
                        <Formik
                            validationSchema={validationSchema}
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                        >
                            {({ touched, errors, values }) => {
                                const contributors = values.contributors
                                return (
                                    <Form>
                                        <FormContainer>

                                            <FieldArray name="contributors">
                                                {({ form, remove, push }) => (
                                                    <div className='flex flex-col space-y-4'>
                                                        {contributors && contributors.length > 0
                                                            ? contributors.map((contributor, index) => {
                                                                const walletAddressFeedback =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `contributors[${index}].walletAddress`
                                                                    )
                                                                const amountFeedback =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `contributors[${index}].amount`
                                                                    )

                                                                return (
                                                                    <div key={index} className='flex flex-row items-center justify-start w-full gap-4' >
                                                                        {/* <div>
                                                                            {organization?.contributors?.some(orgContributor => orgContributor.walletAddress === contributor.walletAddress) ? (
                                                                                (() => {
                                                                                    const orgContributor = organization.contributors.find(orgContributor => orgContributor.walletAddress === contributor.walletAddress);
                                                                                    return (
                                                                                        <div className='mt-7'>
                                                                                            <CustomAvatarAndUsername
                                                                                                imageUrl={orgContributor?.profilePicture}
                                                                                                userName={orgContributor?.username}
                                                                                                avatarSize={40}
                                                                                            />
                                                                                        </div>
                                                                                    );
                                                                                })()
                                                                            ) : (
                                                                                <div className='mt-7'>
                                                                                    <PlaceholderAvatarAndUsername />
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </div> */}
                                                                        <InputGroup className='w-3/4'>
                                                                            <FormItem
                                                                                label="Address"
                                                                                invalid={
                                                                                    walletAddressFeedback.invalid
                                                                                }
                                                                                errorMessage={
                                                                                    walletAddressFeedback.errorMessage
                                                                                }
                                                                                className='flex flex-col m-0 flex-1'
                                                                            >
                                                                                <Field
                                                                                    invalid={
                                                                                        walletAddressFeedback.invalid
                                                                                    }
                                                                                    placeholder="Address"
                                                                                    name={`contributors[${index}].walletAddress`}
                                                                                    onKeyDown={(e: React.KeyboardEvent) => {
                                                                                        if (e.key === 'Enter') {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }}
                                                                                    type="text"
                                                                                    component={
                                                                                        Input
                                                                                    }
                                                                                />
                                                                            </FormItem>
                                                                            <Addon className='mt-[29px] min-w-[130px]'>
                                                                                {organization?.contributors?.some(orgContributor => orgContributor.walletAddress === contributor.walletAddress) ? (
                                                                                    (() => {
                                                                                        const orgContributor = organization.contributors.find(orgContributor => orgContributor.walletAddress === contributor.walletAddress);
                                                                                        return (
                                                                                            <div className='px-1'>
                                                                                                <CustomAvatarAndUsername
                                                                                                    imageUrl={orgContributor?.profilePicture}
                                                                                                    userName={orgContributor?.username}
                                                                                                    avatarSize={20}
                                                                                                />
                                                                                            </div>
                                                                                        );
                                                                                    })()
                                                                                ) : (
                                                                                    <div className='px-1'>
                                                                                        <PlaceholderAvatarAndUsername avatarSize={20} />
                                                                                    </div>
                                                                                )}
                                                                            </Addon>

                                                                        </InputGroup>


                                                                        <FormItem
                                                                            label="Team Points"
                                                                            invalid={
                                                                                amountFeedback.invalid
                                                                            }
                                                                            errorMessage={
                                                                                amountFeedback.errorMessage
                                                                            }
                                                                            className='flex flex-col m-0 w-1/4'
                                                                        >
                                                                            <Field
                                                                                invalid={
                                                                                    amountFeedback.invalid
                                                                                }
                                                                                onKeyDown={(e: React.KeyboardEvent) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                placeholder="Amount"
                                                                                name={`contributors[${index}].amount`}
                                                                                type="number"
                                                                                component={
                                                                                    Input
                                                                                }
                                                                            />
                                                                        </FormItem>
                                                                        <div className='mt-7'>
                                                                            <Button
                                                                                shape="circle"
                                                                                size="sm"
                                                                                variant="twoTone"
                                                                                color='red-500'
                                                                                icon={
                                                                                    <HiTrash className='text-red-500' />
                                                                                }
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })

                                                            : null}
                                                        <div className='flex flex-col items-end justify-end w-full gap-4'>
                                                            <div className='flex flex-row items-center justify-start w-full mt-4'>
                                                                <Button
                                                                    type="button"
                                                                    className="ltr:mr-2 rtl:ml-2"
                                                                    icon={
                                                                        <HiPlus className='text-berrylavender-500' />
                                                                    }
                                                                    onClick={() => {
                                                                        push({
                                                                            walletAddress: '',
                                                                            amount: '',
                                                                        })
                                                                    }}
                                                                >
                                                                    Add Contributor
                                                                </Button>

                                                            </div>

                                                            <Button
                                                                type="submit"
                                                                variant="solid"
                                                                disabled={Object.keys(errors).length > 0 || Object.keys(touched).length === 0}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                        </FormContainer>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </Card>
                </>
            )}
        </>

    )
}

export default ManualAllocation;