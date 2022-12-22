import { hidden } from "public/util/popup"
import {
    INCOGNITO_PARTICIPANT,
    INCOGNITO_EVENT,
    INCOGNITO_USER,
    INCOGNITO_REWARD,
    USER_PARTICIPANT,
    USER_EVENT,
    USER_PACKAGE,
    USER_REWARD,
    REMOVE_STATE,
    USER_CURR_EVENT_HOSTING,
    USER_CURR_EVENT_PLAYING,
    USER_EVENT_CREATING,
    USER_REWARD_CREATING,
    USER_UPDATE_EVENT,
    USER_UPDATE_PARTICIPANT,
    USER_UPDATE_REWARD,
    USER_UPDATE_REWARD_CREATING,
    POPUP_MESSAGE,
    POPUP_STATUS,
    POPUP_VISIBLE
} from "./constants"

const joinState = {
    event: {},
    user: {},
    reward: {},
    participant: {}
}

const userState = {
    event: [],
    user: {},
    reward: [],
    participant: [],
    currEventHosting: {},
    currEventPlaying: {},
    currEventCreating: {},
    currRewardCreating: [],
}

const popUpState = {
    message: "",
    status: false,
    visible: hidden
}

export const playerReducer = (state = joinState, action) => {
    switch (action.type) {
        case INCOGNITO_EVENT: {
            return { ...state, event: action.payload }
        }
        case INCOGNITO_PARTICIPANT: {
            return { ...state, participant: action.payload }
        }
        case INCOGNITO_USER: {
            return { ...state, user: action.payload }
        }
        case INCOGNITO_REWARD: {
            return { ...state, reward: action.payload }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE PLAYER")
            return {
                event: {},
                user: {},
                reward: {},
                participant: {}
            };
        }
        default:
            return state
    }
}
export const userReducer = (state = userState, action) => {
    switch (action.type) {
        case USER_EVENT: {
            return { ...state, event: [...state.event, action.payload] }
        }
        case USER_PARTICIPANT: {
            return { ...state, participant: [...state.participant, action.payload] }
        }
        case USER_PACKAGE: {
            return { ...state, user: action.payload }
        }
        case USER_REWARD: {
            return { ...state, reward: [...state.reward, action.payload] }
        }
        case USER_CURR_EVENT_HOSTING: {
            return { ...state, currEventHosting: action.payload }
        }
        case USER_CURR_EVENT_PLAYING: {
            return { ...state, currEventPlaying: action.payload }
        }
        case USER_EVENT_CREATING: {
            return { ...state, currEventCreating: action.payload }
        }
        case USER_REWARD_CREATING: {
            return { ...state, currRewardCreating: [...state.currRewardCreating, action.payload] }
        }
        case USER_UPDATE_EVENT: {
            return {
                ...state,
                event:
                    () => {
                        const pos = state.event.findIndex((value) => value.eventId === action.payload.eventId)
                        return pos === -1
                            ? state
                            : {
                                ...state,
                                event: [state.event.slice(0, pos), action.payload, state.event.slice(pos + 1)]
                            }
                    }
            }
        }
        case USER_UPDATE_PARTICIPANT: {
            return {
                ...state,
                event:
                    () => {
                        const pos = state.participant.findIndex((value) => value.participantId === action.payload.participantId)
                        return pos === -1
                            ? state
                            : {
                                ...state,
                                event: [state.participant.slice(0, pos), action.payload, state.participant.slice(pos + 1)]
                            }
                    }
            }
        }
        case USER_UPDATE_REWARD: {
            return {
                ...state,
                event:
                    () => {
                        const pos = state.reward.findIndex((value) => value.idReward === action.payload.idReward)
                        return pos === -1
                            ? state
                            : {
                                ...state,
                                event: [state.reward.slice(0, pos), action.payload, state.reward.slice(pos + 1)]
                            }
                    }
            }
        }
        case USER_UPDATE_REWARD_CREATING: {
            return {
                ...state,
                event:
                    () => {
                        const pos = state.currRewardCreating.findIndex((value) => value.idReward === action.payload.idReward)
                        return pos === -1
                            ? state
                            : {
                                ...state,
                                event: [state.currRewardCreating.slice(0, pos), action.payload, state.currRewardCreating.slice(pos + 1)]
                            }
                    }
            }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE USER")
            return {
                event: [],
                user: {},
                reward: [],
                participant: [],
                currEvent: {},
                currEventCreating: {},
                currRewardCreating: [],
            };
        }
        default:
            return state
    }
}
export const popUpReducer = (state = popUpState, action) => {
    switch (action.type) {
        case POPUP_MESSAGE: {
            return { ...state, message: action.payload }
        }
        case POPUP_STATUS: {
            return { ...state, status: action.payload }
        }
        case POPUP_VISIBLE: {
            return { ...state, visible: action.payload }
        }
        case REMOVE_STATE: {
            console.log("REMOVE STATE POPUP")
            return {
                message: "",
                status: false,
                visible: hidden
            };
        }
        default:
            return state
    }
}
