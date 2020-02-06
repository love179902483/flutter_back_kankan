import * as redis from 'redis';
import * as genericPool from 'generic-pool';

import { redisConf } from '../../config/config';

const factory = {
    create: async function(){
        return await redis.createClient( redisConf.port, redisConf.host, {auth_pass: redisConf.authPass});
    },
    destroy: async function(client){
        await client.quit();
    }
}

const opts = {
    max: 10000,
    min: 2
}

const redisPool = genericPool.createPool(factory, opts);

// 放弃上面的连接池，改用直连方式
const RedisClient = redis.createClient( redisConf.port, redisConf.host, {auth_pass: redisConf.authPass});

export { RedisClient };