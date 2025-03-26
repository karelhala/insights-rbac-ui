import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateVariant, EmptyStateFooter } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

interface EmptyWithActionProps {
  title: string;
  icon?: React.ComponentClass<Omit<React.HTMLProps<SVGElement>, 'ref'>, Record<string, unknown>>;
  description: React.ReactNode[];
  actions: React.ReactNode;
}

const EmptyWithAction = ({ title, icon, description, actions, ...props }: EmptyWithActionProps) => (
  <EmptyState headingLevel="h4" icon={icon || SearchIcon} titleText={<>{title}</>} variant={EmptyStateVariant.sm} {...props}>
    <EmptyStateBody className="pf-v5-u-mb-md">
      {description.map((text: React.ReactNode, key: number) => (
        <React.Fragment key={key}>
          {text} <br />
        </React.Fragment>
      ))}
    </EmptyStateBody>
    <EmptyStateFooter>{actions}</EmptyStateFooter>
  </EmptyState>
);

export default EmptyWithAction;
