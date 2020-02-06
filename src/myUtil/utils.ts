import { RedisClient } from '../redis/redis_pool';
import { SingleSocket } from '../types/global';

export interface RedisLindex{
    key: string;
    index: number;
}
export interface RedisLset{
    index: number;
    key: string;
    value?: string;
}

export interface RedisVariable extends RedisLset, RedisLindex{
    name: string;
}

export function RedisList(variable: RedisVariable){

    if(variable.name === 'lindex'){
            return new Promise((resolve, reject)=>{
                RedisClient.lindex(variable.key, variable.index, (error, reply)=>{
                    if(error){
                        reject(error);
                    }
                    else{
                        console.log(reply);
                        resolve(reply);
                    }
                })
            })
    }
    if(variable.name === 'lset'){
        return new Promise((resolve, reject)=>{
            RedisClient.lset(variable.key, variable.index, variable.value, (error, reply)=>{
                if(error)
                    reject(error)
                else
                    resolve(true)
            })
        })
    }
}


export function RedisExists(key: string){
    return new Promise((resolve, reject)=>{
        RedisClient.exists(key, (error, reply)=>{
            if(error){
                console.log(error);
                reject(false);
            }else{
                resolve(reply === 1 ? true : false);
            }
        })
    })
}

// 选择数据库
export function SelectRedisClient (db: number){
    return new Promise((resolve, reject)=>{
        RedisClient.select(db, (error,reply)=>{
            if(error)
                reject(error);
            else
                resolve(reply)
        })
    })
}


// 转化监听event方式
export const SocketEventConvert = {
    toLogin: function(obj){
        return JSON.stringify({
            event: "login",
            data: obj
        }); 
    },
    homeInit: function(obj){
        return JSON.stringify({
            event: "homeInit",
            data: obj
        });
    },
    notifySocket: function(obj){
        console.log('通知他！！！')
        return JSON.stringify({
            event: "notifySocket",
            data: obj
        });
    },
    qiniuToken: function(obj){
        return JSON.stringify({
            event: "qiniuToken",
            data: obj
        });
    }
}

// 删除 socket
export function deleteSocket(socketStore: SingleSocket[], userid: string){
    for(let i=0, j=socketStore.length; i<j; i++){
        const thisSocket: SingleSocket = socketStore[i];
        if(thisSocket.id === userid){
            thisSocket.socket.destroy();
            socketStore.splice(i,1);
        }
    }
}