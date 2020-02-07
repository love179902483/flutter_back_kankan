// const host: string = '127.0.0.1';
const port: number = 1314;

import * as net from 'net';
// import { RedisClient } from './redis/redis_pool';

import { CheckUser, login, logout } from './server/authUser';
import { NormalReturn, SingleSocket } from './types/global';
import { RedisList, SocketEventConvert, deleteSocket } from './myUtil/utils';
import { test } from './server/testInsertRedis_hash';
import { QYRouteGet } from './myRoute/route';


let socketStore: SingleSocket[] = [];
const mySocket = function(socket: net.Socket): void{
    let checkCount: number = 5;
    let userID: string = "";

    let singleSocket: SingleSocket = {
        id:'',
        userinfo: null,
        socket: null
    };
    socket.on('data', async (data) =>{
        // console.log(data.toString())
        checkCount = checkCount - 1;
        // 给几次机会验证，若不通过则关闭socket
        // if(checkCount > 0){
            // 若不存在key 则验证传来的信息若有user信息则开始验证
            if(userID !== ""){
                // console.log(data.toString())
                console.log(`用户存在且已经登录！！！！userid:${singleSocket.id}`);
                QYRouteGet(singleSocket, data.toString(), socketStore);

            }else{
                // 校验用户信息
                const checkUser: CheckUser = new CheckUser(socketStore, data.toString('utf8') );
                const returnMsg: NormalReturn<any> = await checkUser.check();
                console.log(`校验用户返回结果是 ${JSON.stringify(returnMsg) }`);
                if(returnMsg.flag === true){
                    userID = returnMsg.data['phone'];
                    const class_number = returnMsg.data['user_number'];
                    console.log('本SOCKET 的 class_number是：'+class_number);

                    // 设置 每一个 socket 的数据
                    // 若用户登录了，则将现有的socket push到 socketStore中
                    singleSocket.userinfo = returnMsg.data;
                    singleSocket.socket = socket;
                    singleSocket.id = userID;
                    // socket['userInfo'] = returnMsg.data;
                    socketStore.push(singleSocket);

                    try {
                        // 在登录的情况下设置登录状态字段
                        const result = await login(userID); 
                        if (result){
                        
                            socket.write(SocketEventConvert.toLogin(returnMsg));
                        }else{
                            console.log(`${userID}网络原因登录失败，稍后重试！！`)
                            socket.write(SocketEventConvert.toLogin(returnMsg));
                            socket.destroy();
                        }
                    } catch (error) {
                        returnMsg.flag = false;
                        returnMsg.msg = 'set login status error!!'
                        socket.write(SocketEventConvert.toLogin(returnMsg));
                        console.log(error);
                    }
                   
                    // 验证是否将 user 标志字段设置成功， 成功表示登录成功，失败则表示登录失败
                    
                        
                }else{
                    socket.write(SocketEventConvert.toLogin(returnMsg));
                    socket.destroy();
                }
            } 
        // }else{
        //     // socket.write('please check your info then start to chat!'); 
        //     socket.destroy();
        // }
    })
    socket.on('close',()=>{
        console.log(`断开Socket目前用户的id信息是${userID}`)
        if(userID !== "")
            logout(userID);
        else
        console.log('logout,且用户未登录');
        // 从socket中删除次socket
        try {
            deleteSocket(socketStore, userID);
        } catch (error) {
            console.error(`从socketStore中删除${userID}出错`);
            console.error(error);
        }
        
        
    })
    
    socket.on('login', (data)=>{
      
        console.log(data)
    })
    // socketStore.forEach(function(item){
    //     console.log(item);
    // });
} 

    



const socketServer: net.Server = net.createServer(mySocket);

socketServer.listen(port);
console.log(`socket listen in port ${port}`);

socketServer.on('connection', function(socket: net.Socket){
    console.log('socket')
})
