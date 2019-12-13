import Vue from "vue"
import axios from "axios"
const dbSite = "http://localhost:3000/";

// Lib to create guid
const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
const guid = () => s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()

export default {
  // Set Initial Data
  SET_INITIAL_DATA(state, payload) {
    state.boards = payload
  },

  // Set Loading State
  SET_LOADING_STATE(state, payload) {
    state.isLoading = payload
  },

  // Save Task Board
  SAVE_TASKBOARD(state, payload) {
    const board = state.boards.find(b => b._id == payload.id)
    const itemIdx = state.boards.findIndex(b => b._id == payload.id)

    // For existing item
    if (itemIdx > -1) {
      board.name = payload.name
      board.description = payload.description
      
      return axios.put(dbSite+'tasks/'+board._id,Vue.set(state.boards, itemIdx, board));
    }
    // For new item
    else {
      const board = {
        name: payload.name,
        description: payload.description,
        archived: false,
        lists: []
      }
      return axios.post(dbSite+'tasks',board).then(res => {
        state.boards.push(res.data.ops[0]);
      })
    }
  },

  // Archive Task Board
  ARCHIVE_TASKBOARD(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const boardIdx = state.boards.findIndex(b => b._id == payload.boardId)
    board.archived = true
    return axios.put(dbSite+'tasks/'+ board._id,
    Vue.set(state.boards, boardIdx, board));
  },

  // Restore Task Board
  RESTORE_TASKBOARD(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const boardIdx = state.boards.findIndex(b => b._id == payload.boardId)
    board.archived = false
    return axios.put(dbSite+'tasks/'+board._id,
    Vue.set(state.boards, boardIdx, board));
  },

  // Save Task List
  SAVE_TASKLIST(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const list = board.lists.find(l => l.id == payload.listId)
    const listIdx = board.lists.findIndex(l => l.id == payload.listId)

    // For existing item
    if (listIdx > -1) {
      list.name = payload.name
      Vue.set(board.lists, listIdx, list)
      return axios.put(dbSite+'tasks/'+board._id,board);
    }
    // // For new item
    else {
      const list = {
        id: guid(),
        name: payload.name,
        headerColor: "#607d8b",
        archived: false,
        items: []
      }
      board.lists.push(list)
      return axios.put(dbSite+'tasks/'+board._id,board);
    }
  },

  // Archive Task List
  ARCHIVE_TASKLIST(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const list = board.lists.find(l => l.id == payload.listId)
    const listIdx = board.lists.findIndex(l => l.id == payload.listId)
    list.archived = true
    Vue.set(board.lists, listIdx, list);
    return axios.put(dbSite+'tasks/'+board._id,board);
  },

  // Restore Task List
  RESTORE_TASKLIST(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const list = board.lists.find(l => l.id == payload.listId)
    const listIdx = board.lists.findIndex(l => l.id == payload.listId)
    list.archived = false
    Vue.set(board.lists, listIdx, list);
    return axios.put(dbSite+'tasks/'+board._id,board);
  },

  // Reorder TaskBoad Lists
  REORDER_TASKLISTS(state, payload) {
    const board = state.boards.find(b => b._id == payload.boardId)
    board.lists = Vue.set(board, "lists", payload.lists);
    return axios.put(dbSite+'tasks/'+board._id,board);
  },

  // Reorder Task List Items
  REORDER_TASKLIST_ITEMS(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const listIdx = board.lists.findIndex(l => l.id == payload.listId)
    Vue.set(board.lists[listIdx], "items", payload.items)
  },

  // Set Active Board
  SET_ACTIVE_TASKBOARD(state, payload) {
    state.activeBoard = payload.board
  },

  // Save Task List Item
  SAVE_TASKLIST_ITEM(state, payload) {
    debugger;
    const board = state.boards.find(b => b._id == payload.boardId)
    const list = board.lists.find(l => l.id == payload.listId)
    const itemIdx = list.items.findIndex(item => item.id == payload.item.id)

    // For existing item
    if (itemIdx > -1) {
      Vue.set(list.items, itemIdx, payload.item)
    }
    // For new item
    else {
      payload.item.id = guid()
      list.items.push(payload.item)
    }
    console.log('board',board);
    debugger;
    return axios.put(dbSite+'tasks/'+board._id,board);
  },

  // Delete Task List Item
  DELETE_TASKLIST_ITEM(state, payload) {
    const board = state.boards.find(b => b.id == payload.boardId)
    const list = board.lists.find(l => l.id == payload.listId)
    const itemIdx = list.items.findIndex(item => item.id == payload.item.id)
    // For existing item
    if (itemIdx > -1) {
      Vue.delete(list.items, itemIdx)
    }
  }
}
