import { getLastPageOffset, isOffsetValid } from '../shared/pagination';
import { getGroupApi } from '../shared/user-login';

const groupApi = getGroupApi();

export async function fetchGroups({
  limit,
  offset,
  nameMatch,
  scope,
  username,
  excludeUsername,
  filters = {},
  uuid,
  roleNames,
  roleDiscriminator,
  orderBy,
  platformDefault,
  adminDefault,
  system,
  options,
  usesMetaInURL = false,
  chrome,
}) {
  const [groups, auth] = await Promise.all([
    groupApi.listGroups(
      limit,
      offset,
      filters.name,
      nameMatch,
      scope,
      username,
      excludeUsername,
      uuid,
      roleNames,
      roleDiscriminator,
      orderBy,
      platformDefault,
      adminDefault,
      system,
      options
    ),
    chrome?.auth?.getUser(),
  ]);
  const isPaginationValid = isOffsetValid(offset, groups?.meta?.count);
  offset = isPaginationValid ? offset : getLastPageOffset(groups.meta.count, limit);
  let response = isPaginationValid
    ? groups
    : await groupApi.listGroups(
        limit,
        offset,
        filters.name,
        nameMatch,
        scope,
        username,
        uuid,
        roleNames,
        roleDiscriminator,
        orderBy,
        options,
        system,
        platformDefault,
        adminDefault
      );
  return {
    ...response,
    ...(usesMetaInURL
      ? {
          filters,
          pagination: {
            ...response?.meta,
            offset,
            limit,
            redirected: !isPaginationValid,
          },
        }
      : {}),
    ...auth,
  };
}

export async function fetchGroup(uuid) {
  return await groupApi.getGroup(uuid);
}

export async function updateGroup(data) {
  await groupApi.updateGroup(data.uuid, data);
}

export async function addGroup(data) {
  let newGroup = await groupApi.createGroup(data);
  const promises = [];

  if (data.user_list && data.user_list.length > 0) {
    promises.push(groupApi.addPrincipalToGroup(newGroup.uuid, { principals: data.user_list }));
  }

  if (data.roles_list && data.roles_list.length > 0) {
    promises.push(groupApi.addRoleToGroup(newGroup.uuid, { roles: data.roles_list }));
  }

  await Promise.all(promises);
  return newGroup;
}

export async function removeGroups(uuids) {
  return await Promise.all(uuids.map((uuid) => groupApi.deleteGroup(uuid)));
}

export async function deleteMembersFromGroup(groupId, users) {
  return await groupApi.deletePrincipalFromGroup(groupId, users.join(','));
}

export async function addMembersToGroup(groupId, users) {
  return await groupApi.addPrincipalToGroup(groupId, { principals: users });
}

export async function fetchRolesForGroup(groupId, excluded, { limit, offset, name, description }, options = {}) {
  return await groupApi.listRolesForGroup(
    groupId,
    excluded,
    undefined,
    name,
    description,
    undefined,
    undefined,
    limit,
    offset,
    'display_name',
    options
  );
}

export async function fetchAccountsForGroup() {
  return {
    data: [
      { description: 'This is account 1', client_id: 'abra1234-ca56-da789-fg1011', owner: 'rhn-support1', time_created: 123456456 },
      { description: 'This is account 2', client_id: 'bbra1234-ca56-da789-fg1012', owner: 'rhn-support2', time_created: 123456478 },
    ],
    meta: { count: 0 },
  };
}

export async function deleteRolesFromGroup(groupId, roles) {
  return await groupApi.deleteRoleFromGroup(groupId, roles.join(','));
}

export async function addRolesToGroup(groupId, roles) {
  return await groupApi.addRoleToGroup(groupId, { roles });
}

export async function fetchMembersForGroup(groupId, usernames, options = {}) {
  return await groupApi.getPrincipalsFromGroup(groupId, usernames, options.limit, options.offset, options.orderBy);
}

export async function fetchMemberGroups(username) {
  return await groupApi.listGroups(undefined, undefined, undefined, undefined, 'principal', username, undefined);
}
