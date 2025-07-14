const redis=require('redis');

const redisClient=redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11423.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11423
    }
});


module.exports=redisClient;