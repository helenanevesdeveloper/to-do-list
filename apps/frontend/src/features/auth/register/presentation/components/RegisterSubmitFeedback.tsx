import { Box, Button, Text } from '@chakra-ui/react';

type RegisterSubmitFeedbackProps = {
  isSubmitting: boolean;
  formError: string;
};

/** Renders register submit controls plus loading and form-level feedback. */
export default function RegisterSubmitFeedback({
  isSubmitting,
  formError
}: RegisterSubmitFeedbackProps) {
  return (
    <Box borderTopWidth="1px" pt={5}>
      <Button
        type="submit"
        colorScheme="blue"
        width={{ base: 'full', md: 'auto' }}
        isLoading={isSubmitting}
        loadingText="Creating account..."
        isDisabled={isSubmitting}
      >
        Continue
      </Button>
      {isSubmitting ? (
        <Text mt={3} color="gray.600" fontSize="sm" role="status" aria-live="polite">
          Creating your account...
        </Text>
      ) : null}
      {formError ? (
        <Text mt={3} color="red.500" fontSize="sm" role="alert" aria-live="assertive">
          {formError}
        </Text>
      ) : null}
    </Box>
  );
}
