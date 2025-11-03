
import { Role } from './types';

export const ROLES = {
  STUDENT: Role.Student,
  LECTURER: Role.Lecturer,
  PARENT: Role.Parent,
  PRINCIPAL: Role.Principal,
  ADMIN: Role.Admin,
};

export const PATHS = {
  LANDING: '/',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  STUDENT: '/student',
  LECTURER: '/lecturer',
  PARENT: '/parent',
  PRINCIPAL: '/principal',
  ADMIN: '/admin',
  ADMIN_SETUP: '/admin/setup',
};

export const ROLE_DASHBOARD_PATHS: { [key in Role]: string } = {
  [Role.Student]: PATHS.STUDENT,
  [Role.Lecturer]: PATHS.LECTURER,
  [Role.Parent]: PATHS.PARENT,
  [Role.Principal]: PATHS.PRINCIPAL,
  [Role.Admin]: PATHS.ADMIN,
};