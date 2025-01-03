import { Field as FormikField } from "formik";
import { FieldAttributes } from "formik/dist/Field";

/**
 * Wrapper for the Formik Fields
 */
export const Field = (props: FieldAttributes<any>) => {
  return (
    <FormikField
      {...props}
      onKeyDown={(event: KeyboardEvent) => {
        // Handler for basic html inputs to remove focus, if no custom component is passed
        if (event.key === "Enter" || event.key === "Escape") {
          (event.currentTarget as HTMLInputElement).blur();
        }
      }}
    />
  );
};
