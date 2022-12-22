export const selectPopUpReducer = (state) => {
    return state.popUpReducer
}
export const popUpMessageSelector = (state) => {
    return selectPopUpReducer(state).message
}
export const popUpStatusSelector = (state) => {
    return selectPopUpReducer(state).status
}
export const popUpVisibleSelector = (state) => {
    return selectPopUpReducer(state).visible
}