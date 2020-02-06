import { Socket } from "net";
import { AfterLoginData, NormalReturn, HomeInit, StudentInfo, NotifyData, SingleSocket } from "../types/global";
import { GetClassData } from '../server/getClassData';
import { SocketEventConvert } from "../myUtil/utils";
import * as net from 'net';
import { NotifyPhoto } from "../server/notifyPhoto";
import { createQiniuToken } from "../server/getQiniuToken";

export async function QYRouteGet(singleSocket: SingleSocket, data: string, socketStore: SingleSocket[] ){
    let returnMsg: NormalReturn<any> = {
        flag: false,
        data: '',
        msg: ''
    }

    try {
        const getData: AfterLoginData = JSON.parse(data);
        console.log('来自用户的信息是：');
        console.log(getData);
        switch (getData.event){
            case 'homeInit':
                try {
                    const data: HomeInit = getData.data as HomeInit;
                    // 通过班级号获取班级中所有学生的信息并返回
                    const classData: GetClassData = new GetClassData(data.class_number);
                    const allStudentInfo: StudentInfo[] = await classData.getStudents();
                    returnMsg.data = allStudentInfo;
                    returnMsg.flag = true;
                    singleSocket.socket.write(SocketEventConvert.homeInit(returnMsg));
                } catch (error) {
                    returnMsg.msg = 'get class message error !!!'
                    singleSocket.socket.write(SocketEventConvert.homeInit(returnMsg));
                }
                break;

            case "sendPhoto":
                // console.log(singleSocket.userinfo);
                try {
                    const data: NotifyData = getData.data as NotifyData;
                    const notifyClass: NotifyPhoto = new NotifyPhoto(singleSocket, socketStore, data);
                    notifyClass.notify();
                    notifyClass.save();
                } catch (error) {
                    returnMsg.msg = 'Notify class photo error  !!!'
                    singleSocket.socket.write(SocketEventConvert.notifySocket(returnMsg));
                }
                break
            
            case "qiniuToken":
                try {
                    returnMsg.data = createQiniuToken();
                    returnMsg.flag = true;
                    singleSocket.socket.write(SocketEventConvert.qiniuToken(returnMsg));
                } catch (error) {
                    console.log(error);
                }
              
        }


    } catch (error) {

        console.log(error)
    }
}