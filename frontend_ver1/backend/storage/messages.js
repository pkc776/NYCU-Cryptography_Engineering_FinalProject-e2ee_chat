const messages = [];

function addMessage(from, to, content) {
  messages.push({ from, to, content, timestamp: Date.now() });
}

function getMessagesFor(to) {
  return messages.filter(msg => msg.to === to);
}

module.exports = { addMessage, getMessagesFor };
