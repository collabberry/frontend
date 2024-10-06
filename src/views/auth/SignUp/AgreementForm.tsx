import React from 'react';
import { useFormik } from 'formik';
import { FormContainer, FormItem, Input } from '@/components/ui';

interface AgreementFormProps {
    formik: ReturnType<typeof useFormik>;
    values: any;
}

const AgreementForm: React.FC<AgreementFormProps> = ({ values }) => {
    const formik = useFormik({
        initialValues: {
            agreement: {
                marketRate: '',
                commitment: '',
                minFiat: ''
            }
        },
        onSubmit: values => {
            // console.log(values);
        }
    });

    const { marketRate, commitment, minFiat } = values;

    return (
        <FormContainer>
            <FormItem label="Market Rate">
                <Input
                    name="step3.marketRate"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={marketRate || ''}
                />
            </FormItem>
            <FormItem label="Commitment">
                <Input
                    name="step3.commitment"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={commitment || ''
                    }
                />
            </FormItem>
            <FormItem label="Minimum Fiat">
                <Input
                    name="step3.minFiat"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={minFiat || ''}
                />
            </FormItem>
        </FormContainer>
    );
};

export default AgreementForm;