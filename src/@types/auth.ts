export type SignInCredential = {
  userName: string;
  password: string;
};

export type SignInResponse = {
  token: string;
  user: {
    userName: string;
    authority: string[];
    avatar: string;
    email: string;
  };
};

export type UserResponse = {
  username: string;
  profilePic?: string;
  email: string;
};

export type SignUpResponse = SignInResponse;

export type SignUpCredential = {
  userName: string;
  email: string;
  password: string;
};

export type RegisterCredential = {
  username: string;
  email: string;
  telegramHandle?: string;
  profilePicture?: File | null;
};

export type OrganizationData = {
  id?: string;
  par?: number;
  compensationStartDay?: string;
  assessmentStartDelayInDays?: number;
  assessmentDurationInDays?: number
  compensationPeriod?: number;
  name: string;
  logo?: string;
};

export type Assessment = {
  contributorId: string;
  cultureScore: number;
  workScore: number;
  feedbackPositive: string;
  feedbackNegative: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  password: string;
};
