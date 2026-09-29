fetch('https://api.nexra.aryahcr.cc/api/chat/gpt', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
        model: 'gpt-4'
    })
}).then(res => res.text()).then(console.log).catch(console.error);
