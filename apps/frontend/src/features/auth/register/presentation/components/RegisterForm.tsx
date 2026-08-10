import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import RegisterFields from './RegisterFields.js';
import RegisterSubmitFeedback from './RegisterSubmitFeedback.js';
import RegisterSuccess from './RegisterSuccess.js';
import { useRegisterForm } from '../hooks/useRegisterForm.js';

/** Renders either the register form or its success state. */
export default function RegisterForm() {
  const {
    isSuccess,
    successEmail,
    redirectCountdown,
    goToHome,
    formProps,
    requestState,
    isSubmitting,
    emailField,
    passwordField,
    confirmPasswordField
  } = useRegisterForm();

  if (isSuccess) {
    return (
      <RegisterSuccess
        redirectCountdown={redirectCountdown}
        successEmail={successEmail}
        goToHome={goToHome}
      />
    );
  }

  return (
    <Container maxW="lg" py={{ base: 10, md: 16 }}>
      <Stack spacing={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Create your account
          </Heading>
          <Text color="gray.600">
            Register with your email and password to access your files.
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
            <RegisterFields
              emailField={emailField}
              passwordField={passwordField}
              confirmPasswordField={confirmPasswordField}
            />
            <RegisterSubmitFeedback
              isSubmitting={isSubmitting}
              formError={requestState.formError}
            />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
