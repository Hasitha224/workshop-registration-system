export const toPublicUser = (u: {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
}) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  isActive: u.isActive,
  createdAt: u.createdAt,
});