
import * as yup from 'yup';

export const transactionSchema = yup.object({
    amount: yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError('Amount must be a number')
        .positive('Amount must be greater than 0')
        .required('Amount is required'),
    type: yup.string().required('Type is required'),
    categoryId: yup.string().required('Please select a category'),
    date: yup.mixed().required('Date is required'),
    notes: yup.string().max(200, 'Notes too long').nullable(),
}).required();

