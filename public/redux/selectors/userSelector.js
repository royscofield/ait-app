export const selectUserReducer = (state) => {
    return state.userReducer
}
// All events objects that this user hosted or owned
export const userEventSelector = (state) => {
    return selectUserReducer(state).event
}
// This user object after logged in
export const userPackageSelector = (state) => {
    return selectUserReducer(state).user
}
// All players of all events of this user
export const userParticipantSelector = (state) => {
    return selectUserReducer(state).participant
}
// All rewards of this user or of all players
export const userRewardSelector = (state) => {
    return selectUserReducer(state).reward
}
// Event object that this user click to hosting
export const userCurrentEventHostingSelector = (state) => {
    return selectUserReducer(state).currEventHosting
}
// Event object that this user click to playing
export const userCurrentEventPlayingSelector = (state) => {
    return selectUserReducer(state).currEventPlaying
}
// Event object this user is creating
export const userEventCreatingSelector = (state) => {
    return selectUserReducer(state).currEventCreating
}
// Reward objects this user is creating through event
export const userRewardCreatingSelector = (state) => {
    return selectUserReducer(state).currRewardCreating
}