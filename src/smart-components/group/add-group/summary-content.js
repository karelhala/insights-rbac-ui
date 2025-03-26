import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, Content, ContentVariants } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { useIntl } from 'react-intl';
import messages from '../../../Messages';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';

const SummaryContent = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const { isBeta } = useChrome();
  const {
    'group-name': name,
    'group-description': description,
    'users-list': selectedUsers,
    'roles-list': selectedRoles,
    'service-accounts-list': selectedServiceAccounts,
  } = formOptions.getState().values;
  const enableServiceAccounts =
    (isBeta() && useFlag('platform.rbac.group-service-accounts')) || (!isBeta() && useFlag('platform.rbac.group-service-accounts.stable'));

  return (
    <div className="rbac">
      <Stack hasGutter>
        <StackItem>
          <Stack hasGutter>
            <StackItem className="rbac-l-stack__item-summary">
              <Grid>
                <GridItem md={3}>
                  <Content component={ContentVariants.h4} className="rbac-bold-text">
                    {intl.formatMessage(messages.groupName)}
                  </Content>
                </GridItem>
                <GridItem md={9}>
                  <Content component={ContentVariants.p}>{name}</Content>
                </GridItem>
              </Grid>
              <Grid>
                <GridItem md={3}>
                  <Content component={ContentVariants.h4} className="rbac-bold-text">
                    {intl.formatMessage(messages.groupDescription)}
                  </Content>
                </GridItem>
                <GridItem md={9}>
                  <Content component={ContentVariants.p}>{description}</Content>
                </GridItem>
              </Grid>
              {selectedRoles && (
                <Grid>
                  <GridItem md={3}>
                    <Content component={ContentVariants.h4} className="rbac-bold-text">
                      {intl.formatMessage(messages.roles)}
                    </Content>
                  </GridItem>
                  <GridItem md={9}>
                    {selectedRoles.map((role, index) => (
                      <Content component="p" className="pf-v5-u-mb-0" key={index}>
                        {role.label}
                      </Content>
                    ))}
                  </GridItem>
                </Grid>
              )}
              <Grid>
                <GridItem md={3}>
                  <Content component={ContentVariants.h4} className="rbac-bold-text">
                    {intl.formatMessage(messages.members)}
                  </Content>
                </GridItem>
                <GridItem md={9}>
                  {selectedUsers.map((role, index) => (
                    <Content component="p" className="pf-v5-u-mb-0" key={index}>
                      {role.label}
                    </Content>
                  ))}
                </GridItem>
              </Grid>
              <Grid>
                <GridItem md={3}>
                  <Content component={ContentVariants.h4} className="rbac-bold-text">
                    {intl.formatMessage(messages.serviceAccounts)}
                  </Content>
                </GridItem>
                {enableServiceAccounts && (
                  <GridItem md={9}>
                    {selectedServiceAccounts?.map((account, index) => (
                      <Content component="p" className="pf-v5-u-mb-0" key={index}>
                        {account.name}
                      </Content>
                    ))}
                  </GridItem>
                )}
              </Grid>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </div>
  );
};

SummaryContent.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array,
};

export default SummaryContent;
