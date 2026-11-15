export const MEMBER_ROLE = 'Website Members';
export const EDITOR_ROLE = 'Content Editors';
export const ADMIN_ROLE = 'Content Admins';

// Who is allowed to see the Manage button, create and edit (same as AllowedRoles in C#):
export const MANAGER_ROLES = [EDITOR_ROLE, ADMIN_ROLE];

// Who is allowed to delete (same as DeleteRoles in C#). Editors are NOT here:
export const DELETE_ROLES = [ADMIN_ROLE];
