const { addMessage, getMessagesFor } = require('../storage/messages');

exports.sendMessage = (req, res) => {
  const { from, to, content, iv } = req.body;
  console.log('Received message:', { from, to, content: content?.substring(0, 20) + '...', iv: iv?.substring(0, 20) + '...' });
  
  if (!from || !to || !content || !iv) {
    console.error('Missing fields:', { from, to, hasContent: !!content, hasIv: !!iv });
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  try {
    addMessage(from, to, content, iv);
    console.log('Message stored successfully');
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessages = (req, res) => {
  const to = req.params.to;
  console.log('Fetching messages for:', to);
  
  try {
    const messages = getMessagesFor(to);
    console.log('Found messages:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};
