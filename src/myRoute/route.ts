import { Socket } from "net";
import { AfterLoginData, NormalReturn, HomeInit, UserInfo, NotifyData, SingleSocket, ClassInfo, TeacherGetPhotoData } from "../types/global";
import { TeacherGetClass } from '../server/getClassData';
import { SocketEventConvert } from "../myUtil/utils";
import * as net from 'net';
import { NotifyPhoto } from "../server/notifyPhoto";
import { createQiniuToken } from "../server/getQiniuToken";
import { HeartBeat } from '../server/heart';
import { TeacherGetPhoto, TeacherGetPhotoAndSend } from '../server/teacherGetPhoto';

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
            case "heartBeat":
                const thisBeat: number = getData.data;
                // 验证本次 heartBeat 字段是否正确 
                if(thisBeat === 1314){
                    console.log('开始心跳检测---');
                    // const thisHeartBeat = HeartBeat.thisHeartBeat();
                    // thisHeartBeat.setHeartTimer();
                    // 将心跳时间设置到现在
                    singleSocket.lastHeartBeat = Date.now();
                    const heartBeatReturn: number = 1314;
                    singleSocket.socket.write(SocketEventConvert.heartBeat(heartBeatReturn));
                }
                
                break;

            case 'homeInit':
                try {
                    const data: HomeInit = getData.data as HomeInit;
                    // 通过班级号获取班级中所有学生的信息并返回
                    const user_name: string = singleSocket.userinfo.user_name;
                    const user_type: number = singleSocket.userinfo.user_type;
                    const school_id: number = singleSocket.userinfo.school_id;
                    const classData: TeacherGetClass = new TeacherGetClass(user_name, school_id);
                    const allStudentInfo: NormalReturn<ClassInfo[]> = await classData.getAllClass();
                    
                    singleSocket.socket.write(SocketEventConvert.homeInit(allStudentInfo));
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
                break;
            case "sendPhotoToTeacher":
                // 学生发送回来照片后传送给老师
                // console.log(singleSocket.userinfo);
                try {
                    const data: TeacherGetPhotoData = getData.data as TeacherGetPhotoData;
                    const teacherSendPhoto: TeacherGetPhotoAndSend = new TeacherGetPhotoAndSend(singleSocket, socketStore, data);
                    const nowDate: number = Date.now();
                    await teacherSendPhoto.savePhoneData();
                    teacherSendPhoto.toTeacher();
                } catch (error) {
                    returnMsg.msg = 'Notify class photo error  !!!'
                    console.log(error)
                    // singleSocket.socket.write(SocketEventConvert.teacherReturenPhotoToTeacher(returnMsg));
                }
                break;

            case "qiniuToken":
                try {
                    returnMsg.data = createQiniuToken();
                    returnMsg.flag = true;
                    singleSocket.socket.write(SocketEventConvert.qiniuToken(returnMsg));
                } catch (error) {
                    console.log(error);
                }
                break;
            case "teacherGetPhoto":
                const class_id: number = getData['data']['class_id'];
                console.log(JSON.stringify(getData));
                // 老师通过这个请求来获取学生所有图片
                try {
                    const teacherGetPhoto: TeacherGetPhoto = new TeacherGetPhoto(class_id, socketStore, singleSocket);
                    teacherGetPhoto.notifyOnlineSocket();
                } catch (error) {
                    console.log(error);
                }
                break;
        }


    } catch (error) {

        console.log(error)
    }
}