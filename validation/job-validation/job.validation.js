import * as yup from "yup";

export const jobValidationSchema = yup.object().shape({
  client_name: yup.string().required("Client name is required"),
  job_title: yup.string().required("Job title is required"),
  job_date: yup
    .date()
    .required("Job date is required")
    .typeError("Invalid date format"),
  quote: yup
    .number()
    .typeError("Quote must be a number")
    .required("Quote is required")
    .min(0, "Quote must be greater than or equal to 0"),
});
