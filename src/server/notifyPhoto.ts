import * as net from 'net';
import { NotifyData, StudentInfo, NormalReturn, SingleSocket } from '../types/global';
import { SocketEventConvert, SelectRedisClient } from '../myUtil/utils';
import { QYsetHash, QYgetHashAll, QYsetHashArray, QYsetListPush } from '../redis/redis_promise';

export class NotifyPhoto{
    private sourceSocket: SingleSocket;
    private socketStore: SingleSocket[];
    private newData: NotifyData;

    constructor(sourceSocket: SingleSocket, socketStore: SingleSocket[], newData: NotifyData){
        this.sourceSocket = sourceSocket;
        this.socketStore = socketStore;
        this.newData = newData;
    }

    /**
     * 遍历所有现存的socket 寻找和班级一致的socket 将新的数据传送过去
     */
    notify(){
        let returnMsg: NormalReturn<any> = {
            flag: false,
            data: '',
            msg: ''
        }
        for(let i=0, j=this.socketStore.length; i<j;i++){
            const thisSocket: SingleSocket = this.socketStore[i];
            if(thisSocket.userinfo.class_number === this.newData.class_number){
                const targetUserInfo: StudentInfo = this.sourceSocket.userinfo;
                // 将新的照片时间数据修改掉
                targetUserInfo.last_photo_time = this.newData.last_photo_time;
                 // 将新的照片数据修改掉
                targetUserInfo.last_photo = this.newData.last_photo;
                
                returnMsg.flag = true;
                returnMsg.data = targetUserInfo;
                console.log(`向用户${this.newData.username} 发送通知信息!`)
                thisSocket.socket.write(SocketEventConvert.notifySocket(returnMsg));
            }
        }

    }
    // 保存用户的最新图片
    async save(){
        try {
            const userID: string = this.sourceSocket.id;
            const userImageID: string = `${userID}.image`;
            await SelectRedisClient(1);
            await QYsetHashArray(userID, ['last_photo', this.newData.last_photo, 'last_photo_time', this.newData.last_photo_time]);
            await SelectRedisClient(2);
            await QYsetListPush(userImageID, this.newData.last_photo_time);
        } catch (error) {
            console.log(`用户${this.sourceSocket.id}保存照片失败${this.newData.last_photo}`);
            console.log(error);
        }
     
    }
}