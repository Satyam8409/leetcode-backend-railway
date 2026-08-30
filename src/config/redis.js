const redis=require('redis');

const redisClient=redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15603.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15603
    }
});

module.exports=redisClient;