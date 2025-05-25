// 验证付费模型API密钥
const API_KEY = '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';

console.log('💎 验证付费DeepSeek V3模型...\n');

async function testPaidModel() {
    try {
        console.log('🚀 测试付费模型: deepseek/deepseek-chat-v3-0324');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://quarrel-master.vercel.app',
                'X-Title': 'Quarrel Master',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324',
                messages: [
                    {
                        role: 'user',
                        content: '请简单回复：你好'
                    }
                ],
                max_tokens: 100,
            }),
        });

        console.log('API状态码:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API调用失败:');
            console.error('错误详情:', errorText);
            
            // 尝试免费模型
            console.log('\n🔄 尝试免费模型...');
            const freeResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://quarrel-master.vercel.app',
                    'X-Title': 'Quarrel Master',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat:free',
                    messages: [{ role: 'user', content: '你好' }],
                    max_tokens: 50,
                }),
            });
            
            console.log('免费模型状态:', freeResponse.status);
            if (freeResponse.ok) {
                console.log('✅ 免费模型可用');
            } else {
                const freeError = await freeResponse.text();
                console.log('❌ 免费模型也失败:', freeError);
            }
            return;
        }

        const data = await response.json();
        console.log('✅ 付费模型测试成功!');
        console.log('AI回复:', data.choices[0].message.content);
        
        // 测试本地API
        console.log('\n🏠 测试本地API...');
        const localResponse = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '你这技术不行啊',
                intensity: 5
            }),
        });

        console.log('本地API状态:', localResponse.status);
        
        if (localResponse.ok) {
            const localData = await localResponse.json();
            if (localData.success) {
                console.log('✅ 本地API成功! 生成回复:');
                localData.responses.forEach((reply, index) => {
                    console.log(`  ${index + 1}. ${reply}`);
                });
            } else {
                console.log('❌ 本地API返回错误:', localData.error);
            }
        } else {
            const errorText = await localResponse.text();
            console.log('❌ 本地API请求失败:', errorText);
        }

    } catch (error) {
        console.error('💥 测试异常:', error.message);
    }
}

testPaidModel(); 