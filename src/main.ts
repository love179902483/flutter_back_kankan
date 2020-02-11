// const host: string = '127.0.0.1';
const port: number = 1314;

import * as net from 'net';
// import { RedisClient } from './redis/redis_pool';

import { CheckUser, login, logout } from './server/authUser';
import { NormalReturn, SingleSocket, UserInfo } from './types/global';
import { SocketEventConvert, deleteSocket } from './myUtil/utils';
import { test, SetAllStudentData } from './server/testInsertRedis_hash';
import { QYRouteGet } from './myRoute/route';
import { Socket } from 'dgram';
import { checkLastTime } from './server/heart';

// SetAllStudentData();

let socketStore: SingleSocket[] = [];
// 每100秒执行一次定时任务，寻找socket中100秒未响应的socket并且切断
setInterval(()=>{checkLastTime(100000, socketStore)}, 100000);
const mySocket = function(socket: net.Socket): void{
    let checkCount: number = 5;
    let user_name: string = "";

    let singleSocket: SingleSocket = {
        id:'',
        userinfo: null,
        socket: null,
        lastHeartBeat: null,
    };
    socket.on('data', async (data) =>{
        console.log(`现在有${socket}`)
        // 若不存在key 则验证传来的信息若有user信息则开始验证
        if(user_name !== ""){
            // console.log(data.toString())
            console.log(`用户存在且已经登录！！！！userid:${singleSocket.id}`);
            QYRouteGet(singleSocket, data.toString(), socketStore);

        }else{
            // 校验用户信息
            const checkUser: CheckUser = new CheckUser(socketStore, data.toString('utf8') );
            const returnMsg: NormalReturn<any> = await checkUser.check();
            console.log(`校验用户返回结果是 ${JSON.stringify(returnMsg) }`);
            if(returnMsg.flag === true){
                console.log(`设置userInfo: ${JSON.stringify(returnMsg.data)}`)
                const userInfo: UserInfo = returnMsg.data as UserInfo; 
                user_name = userInfo.user_name;
                const class_id = userInfo.class_id;
                console.log(`本SOCKET 的 class_id是：${class_id}, user_name:${user_name}`);
                console.log();
                // 设置 每一个 socket 的数据
                // 若用户登录了，则将现有的socket push到 socketStore中
                singleSocket.userinfo = userInfo;
                singleSocket.socket = socket;
                singleSocket.id = user_name;
                singleSocket.lastHeartBeat = Date.now();
                // socket['userInfo'] = returnMsg.data;
                socketStore.push(singleSocket);

                try {
                    // 在登录的情况下设置登录状态字段
                    const result = await login(user_name); 
                    if (result){
                    
                        socket.write(SocketEventConvert.toLogin(returnMsg));
                    }else{
                        console.log(`${user_name}网络原因登录失败，稍后重试！！`)
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
        
    })
    socket.on('close',()=>{
        console.log(`断开Socket目前用户的id信息是${user_name}`)
        if(user_name !== "")
            logout(user_name);
        else
        console.log('logout,且用户未登录');
        // 从socket中删除次socket
        try {
            deleteSocket(socketStore, user_name);
        } catch (error) {
            console.error(`从socketStore中删除${user_name}出错`);
            console.error(error);
        }
    })
    

    socket.on('error', (error)=>{
        console.log('我中断咯');
        console.log(error);
    })

    socket.on('timeout', (socket: net.Socket)=>{
        socket.destroy();
        console.log('socket超时，断开socket')
    })

    socket.on('connect', ()=>{
        console.log('111111111111111111111111111111111')
    })
    // socketStore.forEach(function(item){
    //     console.log(item);
    // });
} 



const socketServer: net.Server = net.createServer(mySocket);
socketServer.listen(port);




socketServer.on('data', (data)=>{
    console.log(data)   
    console.log('222222222222222222222')
})

socketServer.on('connect', ()=>{
    console.log('-------------------------------')
})


console.log(`socket listen in port ${port}`);

