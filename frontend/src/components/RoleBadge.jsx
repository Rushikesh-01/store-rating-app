const RoleBadge = ({ role }) => {
  const classes = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };
  const labels = { ADMIN: 'Admin', USER: 'User', STORE_OWNER: 'Store Owner' };
  return <span className={classes[role] || 'badge bg-dark-700 text-dark-300'}>{labels[role] || role}</span>;
};
export default RoleBadge;
