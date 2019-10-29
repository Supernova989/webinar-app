module.exports = {
	ROLE_USER: 1,
	ROLE_ASSISTANT: 2,
	ROLE_ADMIN: 3,
	// Hooks for Stripe
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
	// Hooks for ZOOM
	zWH_EVENT_MEETING_STARTED: 'meeting.started',
	zWH_EVENT_MEETING_UPDATED: 'meeting.updated',
	zWH_EVENT_MEETING_ENDED: 'meeting.ended',
	zWH_EVENT_MEETING_CREATED: 'meeting.created',
	zWH_EVENT_MEETING_DELETED: 'meeting.deleted',
	zWH_EVENT_REGISTRATION_CREATED: 'meeting.registration_created',
	zWH_EVENT_REGISTRATION_CANCELLED: 'meeting.registration_cancelled',
};
