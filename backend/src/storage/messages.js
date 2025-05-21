const messages = new Map();

function addMessage(from, to, content, iv) {
  console.log('=== 儲存新訊息 ===');
  console.log('發送者:', from);
  console.log('接收者:', to);
  
  const key = `${from}-${to}`;
  console.log('訊息鍵值:', key);
  
  if (!messages.has(key)) {
    messages.set(key, []);
    console.log('建立新的訊息列表');
  }
  
  const message = {
    from,
    to,
    content,
    iv,
    timestamp: Date.now()
  };
  
  messages.get(key).push(message);
  console.log('訊息已儲存');
  console.log('當前訊息列表:', Array.from(messages.entries()));
}

function getMessagesFor(username) {
  console.log('=== 獲取訊息 ===');
  console.log('使用者:', username);
  
  const result = [];
  for (const [key, msgs] of messages.entries()) {
    console.log('檢查訊息列表:', key);
    // 只返回發給該使用者的訊息
    const relevantMsgs = msgs.filter(msg => msg.to === username);
    console.log('找到相關訊息:', relevantMsgs.length, '條');
    result.push(...relevantMsgs);
  }
  
  // 按時間排序
  const sortedResult = result.sort((a, b) => a.timestamp - b.timestamp);
  console.log('返回訊息總數:', sortedResult.length);
  return sortedResult;
}

module.exports = { addMessage, getMessagesFor };
