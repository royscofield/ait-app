export const selectPlayerReducer = (state) => {
    return state.playerReducer
}
// Event object that incognito player joined
export const playerEventSelector = (state) => {
    return selectPlayerReducer(state).event
}
// User object that hosted event above
export const playerUserSelector = (state) => {
    return selectPlayerReducer(state).user
}
// Player object created after successfully joined
export const playerParticipantSelector = (state) => {
    return selectPlayerReducer(state).participant
}
// Reward that this player got
export const playerRewardSelector = (state) => {
    return selectPlayerReducer(state).reward
}