// May just copy over client methods
module.exports = (client) => ({
	setPresence: client.setPresence,
	editUserInfo: client.editUserInfo,
	getAllUsers: client.getAllUsers,
	fixMessage: client.fixMessage,
	simulateTyping: client.simulateTyping,
	getMessage: client.getMessage,
	getMessages: client.getMessages,
	editMessage: client.editMessage,
	deleteMessage: client.deleteMessage,
	pinMessage: client.pinMessage,
	deletePinnedMessage: client.deletePinnedMessage
});


