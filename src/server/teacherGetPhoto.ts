import { SingleSocket, TeacherGetPhotoData, UserInfo } from "../types/global";
import { SocketEventConvert } from "../myUtil/utils";
import { updateUserLastPhoto, insertUserLastPhoto } from "../mysql/query";

export class TeacherGetPhoto {
    private socketStore: SingleSocket[];
    private singleSocket: SingleSocket;
    private class_id: number;
    
    // private onlineSocket: SingleSocket[] = [];
    constructor(class_id: number, socketStore: SingleSocket[], singleSocket: SingleSocket) {
        this.socketStore = socketStore;
        this.singleSocket = singleSocket;
        this.class_id = class_id;
    }

    notifyOnlineSocket(){
        console.log(this.socketStore.length);
        for(let i=0, j=this.socketStore.length; i<j;i++){
            if(this.socketStore[i].userinfo.class_id === this.class_id){
                console.log(`获取本班级的在线用户,此用户的班级号${this.socketStore[i].userinfo.class_name}`);
                console.log(`获取本班级的在线用户,此用户的ID号${this.socketStore[i].id}`)
                console.log(`${this.socketStore[i].userinfo.class_id}：${this.class_id}`)
                console.log(`${this.socketStore[i].id}在线，发送截图请求！`);
                this.socketStore[i].socket.write(SocketEventConvert.teacherGetPhotoToStudent({'teacher_id':this.singleSocket.id}));
            }
        }

    }
}


export class TeacherGetPhotoAndSend {
    private singleSocket: SingleSocket;
    private socketStore: SingleSocket[];
    private getDataFromStudent: TeacherGetPhotoData;
    private myInfo: UserInfo;
    private nowDate: number = Date.now();

    private to_user_name: string;

    constructor(singleSocket: SingleSocket, socketSotre: SingleSocket[], data: TeacherGetPhotoData) {
        this.singleSocket =singleSocket;
        this.socketStore = socketSotre;
        this.getDataFromStudent = data;
        this.myInfo = singleSocket.userinfo;
        this.to_user_name = data.to_user_name;
    }

    async savePhoneData(){
        
        try {
            await updateUserLastPhoto(this.singleSocket.id, this.getDataFromStudent.last_photo, this.nowDate);
            await insertUserLastPhoto(this.singleSocket, this.getDataFromStudent.last_photo,  this.nowDate);
        } catch (error) {
            console.error(error);
        }
    }
    /**
     * 将学生上传的照片返回给老师
     */
    toTeacher(){
        for(let i=0, j=this.socketStore.length; i<j; i++){
            const thisSocket: SingleSocket = this.socketStore[i];
            if(thisSocket.id === this.to_user_name){
                console.log('这个给到老师的user_name'+this.to_user_name);
                let sendStudentInfo: UserInfo = this.singleSocket.userinfo;
                sendStudentInfo.last_photo = this.getDataFromStudent.last_photo;
                sendStudentInfo.last_photo_time = this.nowDate;

                console.log('老师获取完成学生的照片准备返回给老师')
                console.log(`class_id: ${sendStudentInfo.class_id},school_name:${sendStudentInfo.school_name}, class_name: ${sendStudentInfo.class_name}, user_name: ${sendStudentInfo.user_name}, last_photo: ${sendStudentInfo.last_photo}`);
                thisSocket.socket.write(SocketEventConvert.teacherReturenPhotoToTeacher(sendStudentInfo));
            };
        }
    }
}