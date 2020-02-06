import * as net from 'net';
export interface NormalReturn<T>{
    flag: boolean;
    msg: string;
    data: T;
}


export interface StudentInfo{
    name: string;
    phone: string;
    last_photo: string;
    last_photo_time: string;
    stduent_id: string;
    class_number: string;
    password: string;
    if_login: string;
}

export interface ClassInfo{
    class_id: string;
    student: StudentInfo[];
    year: string; 
}
export interface SchoolInfo{
    school_id: string;
    class: ClassInfo[];
}

// 登录后获取到的信息
export interface AfterLoginData{
    event: string;
    data: any
}

// 初始化home页面的时候数据
export interface HomeInit{
    class_number: string;
}

// 打开摄像头之后传送图片的数据
export interface NotifyData{
    username: string;
    last_photo: string;
    last_photo_time:string;
    class_number: string;
}

// 保存的socket格式为

export interface SingleSocket{
    userinfo: StudentInfo;
    id: string;
    socket: net.Socket;
}