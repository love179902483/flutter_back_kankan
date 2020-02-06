
import {RedisClient} from './redis_pool';
// 获取所有的hash值
export function QYgetHashAll (name: string){
    return new Promise((resolve, reject)=>{
        RedisClient.hgetall(name, (error,reply)=>{
            if(error)
                reject(error);
            else
                resolve(reply)
        })
    })
}
// 获取所有的hash值的key
export function QYgetHashKeys (name: string){
    return new Promise((resolve, reject)=>{
        RedisClient.hkeys(name, (error,reply)=>{
            if(error)
                reject(error);
            else
                resolve(reply as string[])
        })
    })
}
// // 获取所有的hash一个或多个值
// export function QYhmgetHash (name: string[]){
//     return new Promise((resolve, reject)=>{
//         RedisClient.hgetall(name, (error,reply)=>{
//             if(error)
//                 reject(error);
//             else
//                 resolve(reply)
//         })
//     })
// }
// get指定hash
export function QYgetHash (name: string, key: string){
    return new Promise((resolve, reject)=>{
        RedisClient.hget(name, key, (error,reply)=>{
            if(error)
                reject(error);
            else
                resolve(reply)
        })
    })
}
// 设置单个hash下元素的值
export function QYsetHash(name: string, subKey: string, value: string){
    return new Promise((resolve, reject)=>{
        RedisClient.hset(name,subKey, value, (error,reply)=>{
            if(error){
                reject(error);
            }
            else{
                resolve(reply === 0?true:false);
            }
        })
    })
}


// 设置hash下元素的值
export function QYsetHashArray(name: string, value: string[]){
    return new Promise((resolve, reject)=>{
        RedisClient.hmset(name, value, (error,reply)=>{
            if(error)
                reject(error);
            else
                resolve(reply)
        })
    })
}

export function QYsetListPush(name: string, value: string){
    return new Promise((resolve, reject)=>{
        RedisClient.lpush(name, value, (error, reply)=>{
            if(error)
                reject(error)
            else
                resolve(true)
        })
    })
}




export function setSetAdd(name: string, value: string){
    return new Promise((resolve, reject)=>{
        RedisClient.sadd(name, value, (error, reply)=>{
            if(error)
                reject(error)
            else
                resolve(true)
        })
    })
}