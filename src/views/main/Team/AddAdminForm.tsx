import React from "react";
import { Field, FieldProps, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    FormContainer,
    FormItem,
    Input,
    InputGroup,
    Select,
} from "@/components/ui";
import { RootState, setAdmins, setOrganization } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { fieldRequired } from "@/components/collabberry/helpers/validations";
import Addon from "@/components/ui/InputGroup/Addon";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import PlaceholderAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/PlaceholderAvatarAndUsername";
import CreatableSelect from "react-select/creatable";
import { useAdminContractService } from "@/services/AdminContractService";
import { handleError, handleSuccess } from "@/components/collabberry/helpers/ToastNotifications";
import { apiGetOrganizationById } from "@/services/OrgService";
import LottieAnimation from "@/components/collabberry/LottieAnimation";
import * as animationData from "@/assets/animations/clock.json";


const formatContributorLabel = (username: string, walletAddress: string) => {
    const shortenedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return `${username} - ${shortenedAddress}`;
};

const validationSchema = Yup.object().shape({
    walletAddress: Yup.string().required(fieldRequired),

});
interface FormData {
    walletAddress: string;
}

interface AddAdminFormProps {
    handleClose: () => void;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({
    handleClose,
}) => {
    const organization = useSelector((state: RootState) => state.auth.org);
    const { admins } = useSelector((state: RootState) => state.auth.admin);
    const { user } = useSelector((state: RootState) => state.auth);
    const { addAdmin, removeAdmin, ethersSigner, checkAdminContributors } = useAdminContractService();
    const initialData: FormData = {
        walletAddress: "",
    };
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: initialData,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (organization?.teamPointsContractAddress && organization?.id && ethersSigner) {
                try {
                    const response = await addAdmin(organization?.teamPointsContractAddress, values.walletAddress);
                    if (response.status === "success") {
                        handleSuccess("Admin added successfully.");
                        handleClose();

                        try {
                            const response = await checkAdminContributors(organization?.teamPointsContractAddress, organization?.contributors || []);
                            if (response.status === 'success' && response.data) {
                                dispatch(setAdmins({ admins: response.data.adminContributors }));
                            } else {

                                handleError(response.message || "An error occurred while loading contract settings.");
                            }
                        }
                        catch (error) {
                            handleError("An error occurred while loading contract settings.");
                        }

                    } else {
                        console.log("Error adding admin:", response);
                        handleError(response.message || "An error occurred while adding admin.");
                    }
                } catch (error) {
                    console.log("Error adding admin:", error);
                    handleError("An error occurred while adding admin.");
                } finally {
                    formik.setSubmitting(false);
                }


            }
        },
    });

    return (
        <>

            <FormikProvider value={formik}>
                <FormContainer
                    className="xl:max-h-[750px] min-h-[200px] flex flex-col justify-between"
                >
                    {
                        formik.isSubmitting ? (<>
                            <div className="pointer-events-none select-none mt-8 w-full">
                                {animationData && (
                                    <LottieAnimation animationData={animationData} height={160}
                                        width={160} />
                                )}
                            </div>
                        </>) : (
                            <>
                                <InputGroup className='w-full mt-8'>
                                    <FormItem
                                        label="Address"
                                        className='flex flex-col m-0 flex-1 h-full'
                                        invalid={
                                            formik.errors.walletAddress &&
                                            formik.touched.walletAddress
                                        }
                                        errorMessage={formik.errors.walletAddress}
                                    >
                                        <Field name="walletAddress">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps) => (
                                                <Select
                                                    placeholder="Select contributor..."
                                                    field={field}
                                                    form={form}
                                                    options={organization?.contributors?.map(contributor => ({
                                                        ...contributor,
                                                        value: contributor.walletAddress,
                                                        label: formatContributorLabel(contributor.username, contributor.walletAddress),
                                                        isDisabled: admins?.some(admin => admin.walletAddress === contributor.walletAddress),
                                                    })) || []}
                                                    value={organization?.contributors?.map(
                                                        (contributor) => ({
                                                            ...contributor,
                                                            value: contributor.walletAddress,
                                                            label: formatContributorLabel(contributor.username, contributor.walletAddress),
                                                        })
                                                    ).filter(
                                                        (contributor) =>
                                                            contributor.walletAddress ===
                                                            formik.values.walletAddress
                                                    )}
                                                    onChange={(contributor) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            contributor?.walletAddress
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <Addon className='mt-[29px] min-w-[130px]'>
                                        {organization?.contributors?.some(orgContributor => orgContributor.walletAddress === formik.values.walletAddress) ? (
                                            (() => {
                                                const orgContributor = organization.contributors.find(orgContributor => orgContributor.walletAddress === formik.values.walletAddress);
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
                                <div className='text-sm mt-4 items-center text-gray-500 p-1 flex flex-row justify-end'>
                                    <p>This transaction will modify contract settings on chain and require gas fees.</p>
                                </div>
                            </>
                        )
                    }


                </FormContainer>
                <div className="flex justify-end mt-4 gap-4">
                    <Button type="button" onClick={() => handleClose()} disabled={formik.isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </FormikProvider>

        </>


    );
};

export default AddAdminForm;
