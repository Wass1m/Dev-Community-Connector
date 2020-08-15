import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  CLEAR_PROFILE,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  GET_ALL_PROFILES,
  GET_REPO,
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repo: [],
  loading: true,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_PROFILES:
      return {
        ...state,
        loading: false,
        profiles: payload,
      };
    case PROFILE_SUCCESS:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repo: [],
        loading: false,
      };
    default:
      return state;
  }
}
