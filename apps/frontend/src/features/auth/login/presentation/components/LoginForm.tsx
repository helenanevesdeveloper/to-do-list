import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text
} from '@chakra-ui/react';
import { useLoginForm } from '../hooks/useLoginForm.js';

/** Renders the login screen using the composed login presentation hook. */
export default function LoginForm() {
  const {
    formProps,
    requestState,
    isSubmitting,
    emailField,
    passwordField
  } = useLoginForm();

  return (
    <Container maxW="lg" py={{ base: 10, md: 16 }}>
      <Stack spacing={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Login
          </Heading>
          <Text color="gray.600">
            Sign in with your email and password to access your account.
          </Text>
        </Box>

        <Box
          as="form"
          borderWidth="1px"
          borderRadius="lg"
          p={{ base: 5, md: 7 }}
          {...formProps}
        >
          <Stack spacing={5}>
            {requestState.formError ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{requestState.formError}</AlertDescription>
              </Alert>
            ) : null}

            {requestState.successMessage ? (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{requestState.successMessage}</AlertDescription>
              </Alert>
            ) : null}

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
                <FormErrorMessage>{emailField.error}</FormErrorMessage>
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
                <FormErrorMessage>{passwordField.error}</FormErrorMessage>
              </FormControl>
            </Stack>

            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
