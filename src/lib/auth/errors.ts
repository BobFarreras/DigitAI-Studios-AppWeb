// Hem tret el prefix 'auth.' del principi de cada valor
export const AUTH_ERRORS = {
  INVALID_LOGIN: 'error.invalid_login', 
  USER_NOT_IN_ORG: 'error.not_in_org', 
  EMAIL_TAKEN_IN_ORG: 'error.email_taken', 
  TECHNICAL_ERROR: 'error.technical',
  CONFIRM_EMAIL: 'error.confirm_email',
  ACCOUNT_EXISTS_GLOBAL: 'info.account_exists_please_login' 
};

export function mapSupabaseError(errorMsg: string): string {
  if (errorMsg.includes('Invalid login credentials')) return AUTH_ERRORS.INVALID_LOGIN;
  if (errorMsg.includes('Email not confirmed')) return AUTH_ERRORS.CONFIRM_EMAIL;
  if (errorMsg.includes('User already registered')) return AUTH_ERRORS.ACCOUNT_EXISTS_GLOBAL;
  return AUTH_ERRORS.TECHNICAL_ERROR;
}