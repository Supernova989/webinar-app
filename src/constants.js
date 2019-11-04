module.exports = {
	ROLE_USER: 1,
	ROLE_ASSISTANT: 2,
	ROLE_ADMIN: 3,
	// Hooks for Stripe
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
	sWH_EVENT_CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
	// Hooks for ZOOM
	zWH_EVENT_MEETING_STARTED: 'meeting.started',
	zWH_EVENT_MEETING_UPDATED: 'meeting.updated',
	zWH_EVENT_MEETING_ENDED: 'meeting.ended',
	zWH_EVENT_MEETING_CREATED: 'meeting.created',
	zWH_EVENT_MEETING_DELETED: 'meeting.deleted',
	zWH_EVENT_REGISTRATION_CREATED: 'meeting.registration_created',
	zWH_EVENT_REGISTRATION_CANCELED: 'meeting.registration_cancelled',
	zWH_EVENT_USER_CREATED: 'user.created',
	zWH_EVENT_USER_UPDATED: 'user.updated',
	zWH_EVENT_USER_DELETED: 'user.deleted',
	zWH_EVENT_USER_ACTIVATED: 'user.activated',
	zWH_EVENT_USER_DEACTIVATED: 'user.deactivated',
	zWH_EVENT_USER_DISASSOCIATED: 'user.disassociated',
};
