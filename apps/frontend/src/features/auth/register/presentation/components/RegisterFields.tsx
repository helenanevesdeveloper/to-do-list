import type { RegisterFieldModel } from '../../types.js';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack
} from '@chakra-ui/react';

type RegisterFieldsProps = {
  emailField: RegisterFieldModel;
  passwordField: RegisterFieldModel;
  confirmPasswordField: RegisterFieldModel;
};

/** Renders the register form fields using shared auth field primitives. */
export default function RegisterFields({
  emailField,
  passwordField,
  confirmPasswordField
}: RegisterFieldsProps) {
  function renderErrorMessages(messages: string[]) {
    if (messages.length <= 1) {
      return messages[0] || null;
    }

    return (
      <Box as="ul" pl={4}>
        {messages.map((message) => (
          <Box as="li" key={message}>
            {message}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Stack spacing={5}>
      <FormControl isRequired isInvalid={emailField.isInvalid}>
        <FormLabel htmlFor={emailField.id}>Email</FormLabel>
        <Input
          id={emailField.id}
          name={emailField.name}
          type={emailField.type}
          autoComplete={emailField.autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode={emailField.inputMode}
          placeholder={emailField.placeholder}
          maxLength={emailField.maxLength}
          value={emailField.value}
          onChange={emailField.onChange}
          onBlur={emailField.onBlur}
          isDisabled={emailField.isDisabled}
        />
        <FormHelperText color="gray.500">
          Use an email that is not registered yet.
        </FormHelperText>
        <FormErrorMessage>
          {renderErrorMessages(emailField.errorMessages)}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={passwordField.isInvalid}>
        <FormLabel htmlFor={passwordField.id}>Password</FormLabel>
        <Input
          id={passwordField.id}
          name={passwordField.name}
          type={passwordField.type}
          autoComplete={passwordField.autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode={passwordField.inputMode}
          placeholder={passwordField.placeholder}
          maxLength={passwordField.maxLength}
          value={passwordField.value}
          onChange={passwordField.onChange}
          onBlur={passwordField.onBlur}
          isDisabled={passwordField.isDisabled}
        />
        <FormHelperText color="gray.500">
          Minimum 8 chars, with uppercase, lowercase and one digit.
        </FormHelperText>
        <FormErrorMessage>
          {renderErrorMessages(passwordField.errorMessages)}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={confirmPasswordField.isInvalid}>
        <FormLabel htmlFor={confirmPasswordField.id}>Confirm password</FormLabel>
        <Input
          id={confirmPasswordField.id}
          name={confirmPasswordField.name}
          type={confirmPasswordField.type}
          autoComplete={confirmPasswordField.autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode={confirmPasswordField.inputMode}
          placeholder={confirmPasswordField.placeholder}
          maxLength={confirmPasswordField.maxLength}
          value={confirmPasswordField.value}
          onChange={confirmPasswordField.onChange}
          onBlur={confirmPasswordField.onBlur}
          isDisabled={confirmPasswordField.isDisabled}
        />
        <FormErrorMessage>
          {renderErrorMessages(confirmPasswordField.errorMessages)}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
