/* eslint-disable react/jsx-props-no-spreading */
import './AllLists.css';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { ListItem } from '../../Components/ListItem/ListItem';
import { AddList } from '../../Components/AddList/AddList';
import {
  fetchAllListsAsync,
  addListAsync,
  updateListsOrderAsync,
  selectLists,
  selectStatus,
} from './allListsSlice';

const ListItemsWrap = styled.div`
  padding: 8px;
  `;

export function AllLists() {
  const lists = useSelector(selectLists);
  console.log(`lists ${lists}`, lists);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllListsAsync());
  }, [dispatch]);

  let loadingIndicator;
  // TODO: The component isn't re-rendering when reorder the list, so this
  // indicator isn't changing when it should.
  if (status === 'syncing with database') {
    loadingIndicator = (
      <div>Syncing with database...</div>
    );
  }
  if (status === 'loading') {
    loadingIndicator = (
      <div>Loading...</div>
    );
  }
  if (status === 'idle') {
    loadingIndicator = (
      <div>✓ Synced with database</div>
    );
  }
  function onDragEnd(result) {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    dispatch(updateListsOrderAsync({ source, destination }));
  }
  const renderedLists = lists && !lists.error ? lists.map((list, index) => (
    <ListItem
      key={list._id}
      title={list.title}
      id={list._id}
      index={index}
    />
  )) : 'No Lists';
  return (
    <div className="AllLists">
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <h1>Lists</h1>
        <div className="AllLists__loadingIndicator">{loadingIndicator}</div>
        <AddList addListHandler={addListAsync} />
        <Droppable droppableId="lists">
          {(provided) => (
            <ListItemsWrap
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {renderedLists}
              {provided.placeholder}
            </ListItemsWrap>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
