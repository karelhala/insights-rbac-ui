import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, LabelGroup, Content, Title, Button, Popover, Alert, AlertActionCloseButton } from '@patternfly/react-core';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { useIntl } from 'react-intl';
import messages from '../../../Messages';
import './add-role-wizard.scss';

const AddPermissionTemplate = ({ formFields }) => {
  const formOptions = useFormApi();
  const [selectedPermissions, setSelectedPermissions] = useState(formOptions.getState().values['add-permissions-table'] || []);
  const [alertClosed, setAlertClosed] = useState(false);
  const notAllowedBasePermissions = formOptions.getState().values['not-allowed-permissions'];
  const intl = useIntl();

  const unresolvedSplats =
    formOptions.getState().values?.['copy-base-role']?.applications?.filter((app) => !selectedPermissions?.find(({ uuid }) => uuid.includes(app))) ||
    [];
  const addPermissions = formFields[0][0];
  return (
    <div className="rbac">
      {selectedPermissions.length > 0 ? (
        <div className="rbac-c-selected-chips">
          <LabelGroup categoryName={intl.formatMessage(messages.selectedPermissions)}>
            {/* immutable reverse */}
            {selectedPermissions
              .reduce((acc, i) => [i, ...acc], [])
              .map(({ uuid }) => (
                <Label
                  variant="outline"
                  key={uuid}
                  color="blue"
                  isTruncated
                  onClose={() => setSelectedPermissions(selectedPermissions.filter((p) => p.uuid !== uuid))}
                >
                  {uuid}
                </Label>
              ))}
          </LabelGroup>
        </div>
      ) : null}
      <Title headingLevel="h1" size="xl" className="rbac-c-add-permission-title">
        {intl.formatMessage(messages.addPermissions)}
      </Title>
      <Content>
        <Content component="p">
          {intl.formatMessage(messages.selectPermissionsForRole)}
          {unresolvedSplats.length !== 0 && (
            <Popover
              headerContent={intl.formatMessage(messages.onlyGranularPermissions)}
              bodyContent={intl.formatMessage(messages.noWildcardPermissions)}
            >
              <Button icon={<QuestionCircleIcon />} variant="link">
                {intl.formatMessage(messages.whyNotSeeingAllPermissions)}
              </Button>
            </Popover>
          )}
        </Content>
      </Content>
      {notAllowedBasePermissions?.length > 0 && !alertClosed ? (
        <Alert
          variant="custom"
          isInline
          title={`${intl.formatMessage(messages.followingPermissionsCannotBeAdded)} ${notAllowedBasePermissions.join(', ')}`}
          actionClose={<AlertActionCloseButton onClose={() => setAlertClosed(true)} />}
        />
      ) : null}
      {[
        [
          {
            ...addPermissions,
            props: {
              ...addPermissions.props,
              selectedPermissions,
              setSelectedPermissions,
            },
          },
        ],
      ]}
    </div>
  );
};

AddPermissionTemplate.propTypes = {
  formFields: PropTypes.array,
};

export default AddPermissionTemplate;
