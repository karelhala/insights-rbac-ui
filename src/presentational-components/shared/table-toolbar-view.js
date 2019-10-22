import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import debouncePromise from 'awesome-debounce-promise';
import { Toolbar, ToolbarGroup, ToolbarItem, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Pagination } from '@redhat-cloud-services/frontend-components';
import { scrollToTop, getCurrentPage, getNewPage } from '../../helpers/shared/helpers';
import { defaultSettings  } from '../../helpers/shared/pagination';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { Section } from '@redhat-cloud-services/frontend-components';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/TableToolbar';
import { ListLoader } from './loader-placeholders';

export const TableToolbarView = ({
  request,
  isSelectable,
  createRows,
  columns,
  toolbarButtons,
  fetchData,
  data,
  actionResolver,
  areActionsDisabled,
  routes,
  titlePlural,
  titleSingular,
  pagination,
  setCheckedItems,
  filterValue,
  isLoading,
  setFilterValue }) => {
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    fetchData(setRows, filterValue, pagination);
  }, [ filterValue, pagination.limit, pagination.offset ]);

  useEffect(() => {
    setRows(createRows(data, filterValue));
  }, [ data ]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleOnPerPageSelect = limit => request({
    offset: pagination.offset,
    limit
  }).then(({ value: { data }}) => setRows(createRows(data, filterValue)));

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, pagination.limit),
      limit: pagination.limit
    };
    const requestFunc = () => request(options);
    return debounce ? debouncePromise(request, 250)() : requestFunc().then(({ value: { data }}) => setRows(createRows(data, filterValue)));
  };

  const setOpen = (data, uuid) => data.map(row => row.uuid === uuid ?
    {
      ...row,
      isOpen: !row.isOpen
    } : {
      ...row
    });

  const setSelected = (data, uuid) => {
    const newData = data.map(row => row.uuid === uuid ?
      {
        ...row,
        selected: !row.selected
      } : {
        ...row
      });

    const checkedItems = newData.filter(item => (item.uuid && item.selected));
    setCheckedItems(checkedItems);
    return newData;
  };

  const onCollapse = (_event, _index, _isOpen, { uuid }) => setRows((rows) => setOpen(rows, uuid));

  const selectRow = (_event, selected, index, { uuid } = {}) => index === -1
    ? setRows(rows.map(row => ({ ...row, selected })))
    : setRows((rows) => setSelected(rows, uuid));

  const renderToolbar = () => {
    return (<TableToolbar>
      <Level style={ { flex: 1 } }>
        <LevelItem>
          <Toolbar>
            <FilterToolbar onFilterChange={ value => setFilterValue(value) } searchValue={ filterValue }
              placeholder={ `Find a ${titleSingular}` }/>
            { toolbarButtons() }
          </Toolbar>
        </LevelItem>

        <LevelItem>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarItem>
                <Pagination
                  itemsPerPage={ pagination.limit }
                  numberOfItems={ pagination.count }
                  onPerPageSelect={ handleOnPerPageSelect }
                  page={ getCurrentPage(pagination.limit, pagination.offset) }
                  onSetPage={ handleSetPage }
                  direction="down"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </LevelItem>
      </Level>
    </TableToolbar>);
  };

  return (
    isLoading ? <ListLoader/> :
      <Section type="content" id={ `tab-${titlePlural}` }>
        { routes() }
        { renderToolbar() }
        <Table
          aria-label={ `${titlePlural} table` }
          onCollapse={ onCollapse }
          rows={ rows }
          cells={ columns }
          onSelect={ isSelectable && selectRow }
          actionResolver={ actionResolver }
          areActionsDisabled={ areActionsDisabled }
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Section>
  );
};

TableToolbarView.propTypes = {
  isSelectable: propTypes.bool,
  createRows: propTypes.func.isRequired,
  request: propTypes.func.isRequired,
  columns: propTypes.array.isRequired,
  toolbarButtons: propTypes.func,
  fetchData: propTypes.func.isRequired,
  data: propTypes.array,
  pagination: propTypes.shape({
    limit: propTypes.number,
    offset: propTypes.number,
    count: propTypes.number
  }),
  titlePlural: propTypes.string,
  titleSingular: propTypes.string,
  routes: propTypes.func,
  actionResolver: propTypes.func,
  areActionsDisabled: propTypes.func,
  setCheckedItems: propTypes.func,
  filterValue: propTypes.string,
  setFilterValue: propTypes.func,
  isLoading: propTypes.bool
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  toolbarButtons: () => null,
  isSelectable: null,
  routes: () => null
};