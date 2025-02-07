import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    DatePicker,
    FormContainer,
    FormItem,
} from "@/components/ui";
import { useDispatch } from "react-redux";
import { apiEditRound } from "@/services/OrgService";
import { handleError, handleSuccess } from "@/components/collabberry/helpers/ToastNotifications";
import { refreshAllRounds, refreshCurrentRound } from "@/services/LoadAndDispatchService";


const currentUTCMidnight = new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
));

const validationSchema = Yup.object().shape({
    startDate: Yup.date()
        .required("Start date is required")
        .min(currentUTCMidnight, "Start date cannot be earlier than today"),

    endDate: Yup.date()
        .required("End date is required")
        .when('startDate', (startDate, schema) =>
            startDate && schema.min(startDate, "End date cannot be earlier than start date")
        )
        .test(
            "max-15-days",
            "End date cannot be more than 15 days after the start date",
            function (value) {
                const { startDate } = this.parent;
                if (startDate && value) {
                    const diffInDays = (value.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                    return diffInDays <= 15;
                }
                return true;
            }
        ),
});
interface FormData {
    startDate: Date | null;
    endDate: Date | null;
}

interface EditRoundFormProps {
    round: any
    handleClose: () => void;
}

const EditRoundForm: React.FC<EditRoundFormProps> = ({
    round,
    handleClose,
}) => {
    const dispatch = useDispatch();
    const initialData: FormData = {
        startDate: round?.startDate ? new Date(Date.parse(round.startDate)) : null,
        endDate: round?.endDate ? new Date(Date.parse(round.endDate)) : null
    };


    const formik = useFormik({
        initialValues: initialData,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const utcValues = {
                    startDate: values.startDate ? new Date(Date.UTC(
                        values.startDate.getFullYear(),
                        values.startDate.getMonth(),
                        values.startDate.getDate()
                    )) : null,
                    endDate: values.endDate ? new Date(Date.UTC(
                        values.endDate.getFullYear(),
                        values.endDate.getMonth(),
                        values.endDate.getDate(),
                        23, 59, 59
                    )) : null
                };

                const response = await apiEditRound(round.id, utcValues);
                if (response) {
                    refreshAllRounds(dispatch);
                    refreshCurrentRound(dispatch);

                }

                handleSuccess("You have successfully edited the round.");
                handleClose();
            } catch (error: any) {
                handleError(error.response.data.message);
            }
        },
    });

    const handleDateChange = (field: "startDate" | "endDate", date: Date | null) => {
        if (!date) {
            formik.setFieldValue(field, null);
            return;
        }
        formik.setFieldValue(field, new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
    };


    return (
        <>
            {round && (
                <>
                    <FormContainer
                        className="xl:max-h-[750px] max-h-[500px]"
                    >
                        <h2 className="text-2xl font-bold mb-4 mt-4">
                            Edit Round
                        </h2>

                        <div className="grid grid-cols-1 xl:grid-cols-1">
                            <FormItem
                                label="Round Start Date"
                                className="w-full"
                                asterisk={true}
                                errorMessage={formik.errors.startDate}
                                invalid={
                                    formik.touched?.startDate && !!formik.errors?.startDate
                                }
                            >
                                <DatePicker
                                    name="startDate"
                                    value={formik.values.startDate as any}
                                    onChange={(date) => handleDateChange("startDate", date)}
                                    minDate={currentUTCMidnight}
                                    onBlur={formik.handleBlur}
                                />
                            </FormItem>
                            <FormItem
                                label="Round End Date"
                                className="w-full"
                                asterisk={true}
                                errorMessage={formik.errors.endDate}
                                invalid={
                                    formik.touched?.endDate && !!formik.errors?.endDate
                                }
                            >
                                <DatePicker
                                    name="endDate"
                                    minDate={currentUTCMidnight}
                                    value={formik.values.endDate as any}
                                    onChange={(date) => handleDateChange("endDate", date)}
                                    onBlur={formik.handleBlur}
                                />
                            </FormItem>
                        </div>

                    </FormContainer>
                    <div className="flex justify-end mt-4 gap-4">
                        <Button type="button" onClick={() => handleClose()}>
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
                </>
            )}
        </>
    );
};

export default EditRoundForm;
