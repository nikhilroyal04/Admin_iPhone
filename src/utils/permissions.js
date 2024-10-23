export function getModulePermissions(moduleName) {
  // Retrieve the user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if the user exists and has roleAttribute with permissions
  if (user && user.roleAttribute) {
    // Parse the permissions string into an array
    let permissions;
    try {
      permissions = JSON.parse(user.roleAttribute.permission);
    } catch (error) {
      return null;
    }

    // Check if permissions are in the correct format
    if (Array.isArray(permissions)) {
      for (let module of permissions) {
        if (module.module === moduleName) {
          return module.permissionsList;
        }
      }
    }
  }

  // Return null if no permissions found for the specified module
  return null;
}
