import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormContainer, FormItem, Input, toast } from "@/components/ui";
import { handleErrorMessage } from "@/components/collabberry/helpers/ToastNotifications";
import { Loading } from "@/components/shared";

interface Suggestions {
  role: string;
  experience: string;
  location?: string;
  marketRate: number;
  responsibilities?: string[];
}

interface Props {
  suggestions: Suggestions;
  createAgreementMutation: {
    mutate: (data: any) => void;
    isPending: boolean;
  };
}

export const AgreementForm: React.FC<Props> = ({
  suggestions,
  createAgreementMutation,
}) => {
  const formik = useFormik({
    initialValues: {
      commitmentLevel: 0 as number,
      fiatAmount: 0 as number,
      username: "" as string,
    },
    validationSchema: Yup.object({
      commitmentLevel: Yup.number()
        .required("Required")
        .min(1, "Must be at least 1")
        .max(40, "Can’t exceed 40"),
      fiatAmount: Yup.number()
        .required("Required")
        .min(1, "Must be at least $1"),
      username: Yup.string().required("Please enter your name"),
    }),
    onSubmit: (values) => {
      // enrich with suggestions & defaults
      const payload = {
        ...values,
        name: values.username,
        role: suggestions.role,
        experience: suggestions.experience,
        responsibilities:
          suggestions.responsibilities && suggestions.responsibilities.length
            ? suggestions.responsibilities
            : [],
        marketRate: suggestions.marketRate,
        industry: "web3",
        location: suggestions.location || "Remote",
      };

      createAgreementMutation.mutate(payload);
    },
  });

  return (
    <FormContainer>
      {/* Role Summary */}
      <div className="bg-muted/40 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">Role Summary</h3>
        <p className="mb-2">
          <strong>Role:</strong> {suggestions.role}
        </p>
        <p className="mb-2">
          <strong>Experience:</strong> {suggestions.experience}
        </p>
        <p className="mb-2">
          <strong>Location:</strong> {suggestions.location || "Remote"}
        </p>
        <p className="mb-2">
          <strong>Market Rate:</strong> ${suggestions.marketRate}/month
        </p>
        <p className="mb-1">
          <strong>Responsibilities:</strong>
        </p>
        <ul className="list-disc pl-6">
          {suggestions.responsibilities?.map((resp, i) => (
            <li key={i}>{resp}</li>
          ))}
        </ul>
      </div>

      {/* The Form */}
      <div className="space-y-6">
        <FormItem
          label="Weekly Commitment (hours)"
          asterisk
          invalid={
            !!formik.touched.commitmentLevel &&
            !!formik.errors.commitmentLevel
          }
          errorMessage={formik.errors.commitmentLevel}
        >
          <Input
            type="number"
            name="commitmentLevel"
            min={1}
            max={40}
            value={formik.values.commitmentLevel || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={
              !!formik.touched.commitmentLevel &&
              !!formik.errors.commitmentLevel
            }
          />
        </FormItem>

        <FormItem
          label="How much do you need monthly to sustain yourself? (USD)"
          asterisk
          invalid={!!formik.touched.fiatAmount && !!formik.errors.fiatAmount}
          errorMessage={formik.errors.fiatAmount}
        >
          <Input
            type="number"
            name="fiatAmount"
            value={formik.values.fiatAmount || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!formik.touched.fiatAmount && !!formik.errors.fiatAmount}
          />
        </FormItem>

        <FormItem
          label="Your Name"
          asterisk
          invalid={!!formik.touched.username && !!formik.errors.username}
          errorMessage={formik.errors.username}
        >
          <Input
            name="username"
            placeholder="Enter your full name"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!formik.touched.username && !!formik.errors.username}
          />
        </FormItem>

        <div className="space-y-4">
          <Button
            type="button"
            onClick={() => {
              if (!formik.isValid) {
                // show toasts for top‐level errors
                if (formik.errors.username) {
                  handleErrorMessage({
                    title: "Missing information",
                    description: formik.errors.username,
                    variant: "destructive",
                  });
                }
                if (formik.errors.commitmentLevel) {
                  handleErrorMessage({
                    title: "Invalid commitment",
                    description: formik.errors.commitmentLevel,
                    variant: "destructive",
                  });
                }
                return;
              }
              formik.handleSubmit();
            }}
            disabled={createAgreementMutation.isPending}
            className="w-full"
          >
            {createAgreementMutation.isPending && (
              <Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Agreement
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Having trouble? Make sure all fields are filled out correctly.
          </div>
        </div>
      </div>
    </FormContainer>
  );
};