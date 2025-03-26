import React from 'react';
import { Grid, GridItem, Stack, StackItem, Content, ContentVariants, Title } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { useIntl } from 'react-intl';
import messages from '../../../Messages';

const AddRolePermissionSummaryContent = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const {
    'role-name': name,
    'role-description': description,
    'add-permissions-table': selectedPermissions,
    'resource-definitions': resourceDefinitions,
    'has-cost-resources': hasCostResources,
  } = formOptions.getState().values;

  return (
    <Stack hasGutter>
      <StackItem>
        <Content>
          <Title headingLevel="h1" size="xl" className="pf-v5-u-mb-sm">
            {intl.formatMessage(messages.reviewDetails)}
          </Title>
        </Content>
      </StackItem>
      <StackItem className="rbac-l-stack__item-summary">
        <Grid hasGutter>
          <GridItem span={3}>
            <Content className="pf-v5-c-title" component={ContentVariants.h6}>
              {intl.formatMessage(messages.roleName)}
            </Content>
          </GridItem>
          <GridItem span={9}>
            <Content component={ContentVariants.p}>{name}</Content>
          </GridItem>
          <GridItem span={3}>
            <Content className="pf-v5-c-title" component={ContentVariants.h6}>
              {intl.formatMessage(messages.roleDescription)}
            </Content>
          </GridItem>
          <GridItem span={9}>
            <Content component={ContentVariants.p}>{description}</Content>
          </GridItem>
          <GridItem span={3}>
            <Content className="pf-v5-c-title" component={ContentVariants.h6}>
              {intl.formatMessage(messages.addedPermissions)}
            </Content>
          </GridItem>
          <GridItem span={9}>
            <Content component={ContentVariants.p}>
              {selectedPermissions.map((permission, index) => (
                <Content component="p" key={index}>
                  {' '}
                  {permission.uuid}{' '}
                </Content>
              ))}
            </Content>
          </GridItem>
          {hasCostResources && (
            <React.Fragment>
              <GridItem span={3}>
                <Content className="pf-v5-c-title" component={ContentVariants.h6}>
                  {intl.formatMessage(messages.resourceDefinitions)}
                </Content>
              </GridItem>
              <GridItem span={9}>
                <Content component={ContentVariants.p}>
                  {resourceDefinitions.map(({ resources }) =>
                    resources.map((resource, index) => (
                      <Content component="p" key={index}>
                        {' '}
                        {resource}{' '}
                      </Content>
                    ))
                  )}
                </Content>
              </GridItem>
            </React.Fragment>
          )}
        </Grid>
      </StackItem>
    </Stack>
  );
};

export default AddRolePermissionSummaryContent;
