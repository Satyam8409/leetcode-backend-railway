const redis=require('redis');

const redisClient=redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14132.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14132
    }
});

module.exports=redisClient;