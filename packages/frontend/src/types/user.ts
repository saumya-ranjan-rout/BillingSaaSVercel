export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  pushToken?: string;
  biometricEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName: string;
  subdomain: string;
}

export interface UserLoginData {
  email: string;
  password: string;
  tenantId: string;
}
