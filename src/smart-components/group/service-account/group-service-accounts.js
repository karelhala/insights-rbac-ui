import React, { useState, useEffect, useContext, useRef, Suspense, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Outlet, createSearchParams, useParams } from 'react-router-dom';
import { Alert, Bullseye, Button, Card, CardBody, Text, TextContent, TextVariants } from '@patternfly/react-core';
import Section from '@redhat-cloud-services/frontend-components/Section';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { defaultSettings } from '../../../helpers/shared/pagination';
import { TableToolbarView } from '../../../presentational-components/shared/table-toolbar-view';
import { fetchServiceAccountsForGroup } from '../../../redux/actions/group-actions';
import { getDateFormat } from '../../../helpers/shared/helpers';
import { DEFAULT_ACCESS_GROUP_ID } from '../../../utilities/constants';
import PermissionsContext from '../../../utilities/permissions-context';
import AppLink from '../../../presentational-components/shared/AppLink';
import useAppNavigate from '../../../hooks/useAppNavigate';
import messages from '../../../Messages';
import pathnames from '../../../utilities/pathnames';
import './group-service-accounts.scss';

const createRows = (data = [], checkedRows = []) =>
  data?.reduce(
    (acc, { uuid, name, clientID, owner, time_created: timeCreated }) => [
      ...acc,
      {
        uuid,
        title: name,
        cells: [
          name,
          clientID,
          owner,
          <Fragment key={`${name}-modified`}>
            <DateFormat date={timeCreated} type={getDateFormat(timeCreated)} />
          </Fragment>,
        ],
        selected: Boolean(checkedRows && checkedRows.find((row) => row.uuid === uuid)),
      },
    ],
    []
  );

const reducer = ({ groupReducer: { selectedGroup, systemGroup, groups } }) => ({
  serviceAccounts: selectedGroup.serviceAccounts?.data || [],
  pagination: { ...defaultSettings, ...(selectedGroup?.serviceAccounts?.meta || {}) },
  groupsPagination: groups.pagination || groups.meta,
  groupsFilters: groups.filters,
  isLoading: selectedGroup.serviceAccounts.isLoading,
  isAdminDefault: selectedGroup.admin_default,
  systemGroupUuid: systemGroup?.uuid,
  group: selectedGroup,
  platformDefault: selectedGroup.platform_default,
});

const GroupServiceAccounts = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useAppNavigate();
  const { groupId } = useParams();
  const [clientIDValue, setClientIDValue] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const { userAccessAdministrator, orgAdmin } = useContext(PermissionsContext);
  const hasPermissions = useRef(orgAdmin || userAccessAdministrator);
  const { serviceAccounts, pagination, isLoading, isAdminDefault, systemGroupUuid, platformDefault } = useSelector(reducer);

  const fetchGroupAccounts = (groupId, options) => dispatch(fetchServiceAccountsForGroup(groupId, options));

  const columns = [
    { title: intl.formatMessage(messages.name) },
    { title: intl.formatMessage(messages.clientId) },
    { title: intl.formatMessage(messages.owner) },
    { title: intl.formatMessage(messages.timeCreated) },
  ];

  const fetchData = useCallback(() => {
    if (groupId !== DEFAULT_ACCESS_GROUP_ID) {
      fetchGroupAccounts(groupId, pagination);
    } else {
      systemGroupUuid && fetchGroupAccounts(systemGroupUuid, pagination);
    }
  }, [systemGroupUuid, groupId]);

  useEffect(() => {
    fetchData();
  }, [systemGroupUuid]);

  useEffect(() => {
    hasPermissions.current = orgAdmin || userAccessAdministrator;
  }, [orgAdmin, userAccessAdministrator]);

  const actionResolver = ({ uuid }) => [
    ...(hasPermissions.current && !isAdminDefault
      ? [
          {
            title: intl.formatMessage(messages.remove),
            onClick: () =>
              navigate({
                pathname: pathnames['group-service-accounts-remove-group'].link.replace(':groupId', groupId),
                search: createSearchParams({ name: uuid }).toString(),
              }),
          },
        ]
      : []),
  ];

  const toolbarButtons = () => [
    <AppLink className="rbac-m-hide-on-sm" to={pathnames['group-add-service-account'].link.replace(':groupId', groupId)} key="add-to-group">
      <Button ouiaId="add-service-account-button" variant="primary" className="rbac-m-hide-on-sm" aria-label="Add service account to group">
        {intl.formatMessage(messages.addServiceAccount)}
      </Button>
    </AppLink>,
    {
      label: intl.formatMessage(messages.remove),
      props: {
        isDisabled: selectedAccounts.length === 0,
      },
      onClick: () => {
        const searchParams = createSearchParams();
        selectedAccounts.forEach(({ name }) => searchParams.append('name', name));
        navigate({
          pathname: pathnames['group-service-accounts-remove-group'].link.replace(':groupId', groupId),
          search: searchParams.toString(),
        });
      },
    },
    {
      label: intl.formatMessage(messages.addServiceAccount),
      props: {
        className: 'rbac-m-hide-on-md',
      },
      onClick: () => navigate(pathnames['group-add-service-account'].link.replace(':groupId', groupId)),
    },
  ];
  return (
    <React.Fragment>
      <Section type="content" id="tab-service-accounts">
        {platformDefault ? (
          <Card>
            <CardBody>
              <Bullseye>
                <TextContent>
                  <Text component={TextVariants.h1}>{intl.formatMessage(messages.noAccountsInDefaultAccess)}</Text>
                </TextContent>
              </Bullseye>
            </CardBody>
          </Card>
        ) : (
          <>
            <Alert
              className="rbac-service-accounts-alert"
              variant="info"
              isInline
              isPlain
              title={intl.formatMessage(messages.visitServiceAccountsPage, {
                link: (
                  <AppLink to="/service-accounts" linkBasename="/iam">
                    {intl.formatMessage(messages.serviceAccountsPage)}
                  </AppLink>
                ),
              })}
            />
            <TableToolbarView
              columns={columns}
              isSelectable
              rows={createRows(serviceAccounts, selectedAccounts)}
              data={serviceAccounts}
              filterValue={clientIDValue}
              fetchData={(config) => fetchGroupAccounts(groupId, config)}
              emptyFilters={{ description: '' }}
              setFilterValue={({ clientID }) => {
                typeof clientID !== 'undefined' && setClientIDValue(clientID);
              }}
              isLoading={isLoading}
              pagination={pagination}
              checkedRows={selectedAccounts}
              setCheckedItems={setSelectedAccounts}
              titlePlural={intl.formatMessage(messages.serviceAccounts).toLowerCase()}
              titleSingular={intl.formatMessage(messages.serviceAccount)}
              toolbarButtons={toolbarButtons}
              actionResolver={actionResolver}
              emptyProps={{
                title: intl.formatMessage(messages.noGroupAccounts),
                description: [intl.formatMessage(isAdminDefault ? messages.contactServiceTeamForAccounts : messages.addAccountsToThisGroup), ''],
              }}
              filters={[{ key: 'clientID', value: clientIDValue }]}
              tableId="group-accounts"
              ouiaId="group-accounts"
            />
          </>
        )}
      </Section>
      {!platformDefault ? (
        <Suspense>
          <Outlet
            context={{
              [pathnames['group-service-accounts-remove-group'].path]: {
                postMethod: (promise) => {
                  setSelectedAccounts([]);
                  navigate(pathnames['group-detail-service-accounts'].link.replace(':groupId', groupId));
                  if (promise) {
                    promise.then?.(fetchData);
                  }
                },
              },
              [pathnames['group-add-service-account'].path]: {
                postMethod: (promise) => {
                  navigate(pathnames['group-detail-service-accounts'].link.replace(':groupId', groupId));
                  if (promise) {
                    promise.then?.(fetchData);
                  }
                },
              },
            }}
          />
        </Suspense>
      ) : null}
    </React.Fragment>
  );
};

export default GroupServiceAccounts;
