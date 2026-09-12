export const FEEDBACK_TYPES = [
  { label: "Bug", value: "Bug Report" },
  { label: "Feature", value: "Feature Request" },
  { label: "Question", value: "Question" },
  { label: "Other", value: "Other" },
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export const FEEDBACK_MESSAGE_MAX = 2000;
export const FEEDBACK_EMAIL_MAX = 254;

export function isFeedbackType(value: unknown): value is FeedbackType {
  return FEEDBACK_TYPES.some((type) => type.value === value);
}
