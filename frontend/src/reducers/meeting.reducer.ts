import {
	FETCH_MEETINGS
} from '../actions/types';
import {Action} from "redux";

interface ZoomMeeting {
	id: number;
	agenda: string;
	topic: string;
}

interface DefaultState {
	items: ZoomMeeting[];
	isFetching: boolean;
}

const defaultState: DefaultState = {
	items: [],
	isFetching: false
};

interface MeetingAction extends Action {
	payload: ZoomMeeting[]
}

const reducer = (state = defaultState, action: MeetingAction) => {
	switch (action.type) {
		case FETCH_MEETINGS: {
			state = {...state, items: action.payload};
			break;
		}
	}
	
	return state;
};

export default reducer;
