import React from 'react';
import { useFlag } from '@unleash/proxy-client-react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Title, DescriptionListGroup, DescriptionList, DescriptionListTerm, DescriptionListDescription, Content } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import { BUNDLES, WORKSPACE_ACCOUNT, WORKSPACE_DESCRIPTION, WORKSPACE_FEATURES, WORKSPACE_NAME, WORKSPACE_PARENT } from './schema';
import messages from '../../../Messages';

const ReviewStep = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const values = formOptions.getState().values;
  const enableBillingFeatures = useFlag('platform.rbac.workspaces-billing-features');

  return (
    <div className="rbac">
      <Title headingLevel="h1" size="xl" className="pf-v5-u-mb-lg">
        {intl.formatMessage(messages.reviewNewWorkspace)}
      </Title>
      <Content component="p" className="pf-v5-u-mb-xl">
        {intl.formatMessage(messages.reviewWorkspaceDescription)}
      </Content>
      <DescriptionList isHorizontal termWidth="25%">
        <DescriptionListGroup>
          <DescriptionListTerm>{intl.formatMessage(messages.workspaceName)}</DescriptionListTerm>
          <DescriptionListDescription>{values[WORKSPACE_NAME]}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{intl.formatMessage(messages.parentWorkspace)}</DescriptionListTerm>
          <DescriptionListDescription>{values[WORKSPACE_PARENT].name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{intl.formatMessage(messages.workspaceDetails)}</DescriptionListTerm>
          <DescriptionListDescription>{values[WORKSPACE_DESCRIPTION] ?? '-'}</DescriptionListDescription>
        </DescriptionListGroup>
        {enableBillingFeatures && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>{intl.formatMessage(messages.billingAccount)}</DescriptionListTerm>
              <DescriptionListDescription>{values[WORKSPACE_ACCOUNT]}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{intl.formatMessage(messages.availableFeatures)}</DescriptionListTerm>
              <DescriptionListDescription>
                {values[WORKSPACE_FEATURES]?.length > 0 ? (
                  values[WORKSPACE_FEATURES].map((item: string) => (
                    <Content component="p" key={item}>
                      {BUNDLES.find((bundle) => bundle.value === item)?.label}
                    </Content>
                  ))
                ) : (
                  <Content component="p">-</Content>
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        {values[WORKSPACE_FEATURES]?.length > 0 ? (
          <DescriptionListGroup>
            <DescriptionListTerm>{intl.formatMessage(messages.earMarkOfFeatures)}</DescriptionListTerm>
            <DescriptionListDescription>
              {values[WORKSPACE_FEATURES].map((item: string) => {
                const bundle = BUNDLES.find((bundle) => bundle.value === item);
                return <Content component="p" key={item}>{`${bundle?.label}: ${values[`ear-mark-${bundle?.value}-cores`] ?? 0} Cores`}</Content>;
              })}
            </DescriptionListDescription>
          </DescriptionListGroup>
        ) : null}
      </DescriptionList>
    </div>
  );
};

export default ReviewStep;
