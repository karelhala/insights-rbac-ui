import React, { useContext } from 'react';
import { Button, EmptyState, EmptyStateVariant, EmptyStateBody, EmptyStateActions, EmptyStateFooter } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { AddRoleWizardContext } from './add-role-wizard';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import messages from '../../../Messages';
import AppLink from '../../../presentational-components/shared/AppLink';
import pathnames from '../../../utilities/pathnames';

const AddRoleSuccess = ({ onClose }) => {
  const { setHideForm, setWizardSuccess } = useContext(AddRoleWizardContext);
  const intl = useIntl();
  return (
    <EmptyState
      headingLevel="h4"
      icon={CheckCircleIcon}
      titleText={<>{intl.formatMessage(messages.roleCreatedSuccessfully)}</>}
      variant={EmptyStateVariant.lg}
    >
      <EmptyStateBody></EmptyStateBody>
      <EmptyStateFooter>
        <Button onClick={onClose} variant="primary">
          {intl.formatMessage(messages.exit)}
        </Button>
        <EmptyStateActions>
          <Button
            onClick={() => {
              setHideForm(false);
              setWizardSuccess(false);
            }}
            variant="link"
          >
            {intl.formatMessage(messages.createAnotherRole)}
          </Button>
          <Button component={(props) => <AppLink to={pathnames.groups.link} {...props} />} variant="link">
            {intl.formatMessage(messages.addRoleToGroup)}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

AddRoleSuccess.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddRoleSuccess;
