import * as net from 'net';
import { NotifyData, UserInfo, NormalReturn, SingleSocket } from '../types/global';
import { SocketEventConvert } from '../myUtil/utils';
// import { QYsetHash, QYgetHashAll, QYsetHashArray, QYsetListPush } from '../redis/redis_promise';
import { updateUserLastPhoto, insertUserLastPhoto } from '../mysql/query';

export class NotifyPhoto {
    private sourceSocket: SingleSocket;
    private socketStore: SingleSocket[];
    private newData: NotifyData;

    constructor(sourceSocket: SingleSocket, socketStore: SingleSocket[], newData: NotifyData) {
        this.sourceSocket = sourceSocket;
        this.socketStore = socketStore;
        this.newData = newData;
    }

    /**
     * 遍历所有现存的socket 寻找和班级一致的socket 将新的数据传送过去
     */
    notify() {
        let returnMsg: NormalReturn<any> = {
            flag: false,
            data: '',
            msg: ''
        }
        for (let i = 0, j = this.socketStore.length; i < j; i++) {
            const thisSocket: SingleSocket = this.socketStore[i];
            if (thisSocket.userinfo.class_id === this.newData.class_id) {
                const targetUserInfo: UserInfo = this.sourceSocket.userinfo;
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
    async save() {
        const userID: string = this.sourceSocket.id;
        const userImageID: string = `${userID}.image`;
        const nowTime: number = Date.now();
        try {
            // await SelectRedisClient(1);
            await updateUserLastPhoto(userID, this.newData.last_photo, nowTime);
            // await QYsetHashArray(userID, ['last_photo', this.newData.last_photo, 'last_photo_time', this.newData.last_photo_time]);
        } catch (error) {
            console.error(`用户${this.sourceSocket.id}保存${this.newData.last_photo}和${this.newData.last_photo_time}出错`);
        }
        try {
            // await SelectRedisClient(2);
            await insertUserLastPhoto(this.sourceSocket, this.newData.last_photo, nowTime);
            // await QYsetHashArray(userImageID,  [this.newData.last_photo_time, this.newData.last_photo, ]);
        } catch (error) {
            console.error(`用户${userImageID}保存${this.newData.last_photo}出错`);
        }



    }
}