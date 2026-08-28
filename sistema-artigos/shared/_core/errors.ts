export function ForbiddenError(message = "Forbidden") {
  return new Error(message);
}
