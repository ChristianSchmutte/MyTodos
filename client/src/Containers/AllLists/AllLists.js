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
  updateListsOrder,
  selectLists,
  selectStatus,
} from './allListsSlice';

const ListItemsWrap = styled.div`
  padding: 8px;
  `;

export function AllLists() {
  const lists = useSelector(selectLists);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllListsAsync());
  }, [dispatch]);

  let loadingIndicator;
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

    dispatch(updateListsOrder({ source, destination }));
  }

  const renderedLists = lists.map((list, index) => (
    <ListItem
      key={list._id}
      title={list.title}
      id={list._id}
      index={index}
    />
  ));
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
