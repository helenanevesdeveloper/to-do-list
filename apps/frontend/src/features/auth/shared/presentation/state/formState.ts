import type {
  AuthFieldModel,
  FieldConfig,
  FieldErrors,
  MappedFieldError,
  RequestState,
  TouchedFields
} from '../../types.js';
import { clearFieldError } from '../utils/formHelpers.js';

type CreateFieldStateArgs<Name extends string> = {
  name: Name;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: AuthFieldModel<Name>['inputMode'];
  maxLength: number;
  value: string;
  error: string;
  isInvalid: boolean;
  isDisabled: boolean;
  handleChange: AuthFieldModel<Name>['onChange'];
  handleBlur: AuthFieldModel<Name>['onBlur'];
};

function createFieldState<Name extends string>({
  name,
  type,
  autoComplete,
  placeholder,
  inputMode,
  maxLength,
  value,
  error,
  isInvalid,
  isDisabled,
  handleChange,
  handleBlur
}: CreateFieldStateArgs<Name>): AuthFieldModel<Name> {
  return {
    id: name,
    name,
    type,
    autoComplete,
    placeholder,
    inputMode,
    maxLength,
    value,
    error,
    isInvalid,
    isDisabled,
    onChange: handleChange,
    onBlur: handleBlur
  };
}

export function createRequestStateFactory<
  Name extends string,
  SuccessFieldName extends string
>({
  createEmptyFieldErrors,
  successFieldName
}: {
  createEmptyFieldErrors: () => FieldErrors<Name>;
  successFieldName: SuccessFieldName;
}) {
  function createBaseRequestState(
    overrides: Partial<RequestState<Name, SuccessFieldName>> = {}
  ): RequestState<Name, SuccessFieldName> {
    return {
      status: 'idle',
      formError: '',
      fieldErrors: createEmptyFieldErrors(),
      [successFieldName]: '',
      ...overrides
    } as RequestState<Name, SuccessFieldName>;
  }

  return {
    createIdleRequestState(): RequestState<Name, SuccessFieldName> {
      return createBaseRequestState();
    },
    createSubmittingRequestState(): RequestState<Name, SuccessFieldName> {
      return createBaseRequestState({
        status: 'submitting'
      } as Partial<RequestState<Name, SuccessFieldName>>);
    },
    createSuccessRequestState(
      successValue: string
    ): RequestState<Name, SuccessFieldName> {
      return createBaseRequestState({
        status: 'success',
        [successFieldName]: successValue
      } as Partial<RequestState<Name, SuccessFieldName>>);
    },
    createErrorRequestState(
      mappedError: MappedFieldError<Name>
    ): RequestState<Name, SuccessFieldName> {
      return createBaseRequestState({
        status: 'error',
        formError: mappedError.formError,
        fieldErrors: mappedError.fieldErrors
      } as Partial<RequestState<Name, SuccessFieldName>>);
    },
    updateRequestStateForFieldChange(
      currentRequestState: RequestState<Name, SuccessFieldName>,
      fieldName: Name
    ): RequestState<Name, SuccessFieldName> {
      return {
        ...currentRequestState,
        status:
          currentRequestState.status === 'error'
            ? 'idle'
            : currentRequestState.status,
        formError: '',
        [successFieldName]: '',
        fieldErrors: clearFieldError(currentRequestState.fieldErrors, fieldName)
      } as RequestState<Name, SuccessFieldName>;
    }
  };
}

/**
 * Builds field view-models from declarative field configs plus current UI state.
 */
export function createFieldModels<
  ModelKey extends string,
  Name extends string
>({
  fieldConfigs,
  validationErrors,
  serverErrors,
  touched,
  isSubmitted,
  isSubmitting,
  handleChange,
  handleBlur
}: {
  fieldConfigs: FieldConfig<ModelKey, Name>[];
  validationErrors: FieldErrors<Name>;
  serverErrors: FieldErrors<Name>;
  touched: TouchedFields<Name>;
  isSubmitted: boolean;
  isSubmitting: boolean;
  handleChange: AuthFieldModel<Name>['onChange'];
  handleBlur: AuthFieldModel<Name>['onBlur'];
}): Record<ModelKey, AuthFieldModel<Name>> {
  return Object.fromEntries(
    fieldConfigs.map((fieldConfig) => {
      const error =
        validationErrors[fieldConfig.name] || serverErrors[fieldConfig.name];
      const isInvalid =
        ((touched[fieldConfig.name] || isSubmitted) &&
          Boolean(validationErrors[fieldConfig.name])) ||
        Boolean(serverErrors[fieldConfig.name]);

      return [
        fieldConfig.modelKey,
        createFieldState({
          ...fieldConfig,
          error,
          isInvalid,
          isDisabled: isSubmitting,
          handleChange,
          handleBlur
        })
      ];
    })
  ) as Record<ModelKey, AuthFieldModel<Name>>;
}
