const errorMessages: Record<string, string> = {
  invalid_type: "must be a valid type",
  too_small: "is too short",
  too_big: "is too long",
  invalid_enum_value: "must be a valid choice",
  invalid_string: "must be a valid string",
  invalid_date: "must be a valid date",
  not_multiple_of: "must be a multiple of the required value",
  unrecognized_keys: "contains unrecognized keys"
};

export const formatZodError: any = (zodErrors: any[]): string => {
  if (!Array.isArray(zodErrors) || zodErrors.length === 0)
    return "An unknown error occurred.";

  const firstError: any = zodErrors[0];
  const fieldName: string = firstError.path?.[0] || "Field";
  const expected: string = firstError.expected
    ? `Expected: ${firstError.expected}`
    : "";
  const received: string = firstError.received
    ? `Received: ${firstError.received}`
    : "";
  const defaultMsg: string = firstError.message.toLowerCase();
  const customMessage: string = errorMessages[firstError.code] || defaultMsg;

  // Constructing the message
  let message: string = `${fieldName} field ${customMessage}`;

  if (firstError.code === "invalid_type") {
    message += ` (${expected}, but got ${received})`;
  }

  return message;
};
