const { addMessage, getMessagesFor } = require('../storage/messages');

exports.sendMessage = (req, res) => {
  const { from, to, content } = req.body;
  if (!from || !to || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  addMessage(from, to, content);
  res.status(201).json({ message: 'Message sent' });
};

exports.getMessages = (req, res) => {
  const to = req.params.to;
  res.json(getMessagesFor(to));
};
