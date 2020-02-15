import * as net from 'net';
export interface NormalReturn<T>{
    flag: boolean;
    msg: string;
    data: T;
}


// export interface StudentInfo{
//     name: string;
//     phone: string;
//     last_photo: string;
//     last_photo_time: number;
//     school_id: number;
//     user_type: number;
//     class_id: number;
//     if_login: number;
//     user_name: string;
//     class_name: string;
// }

export interface ClassInfo{
    class_id: number;
    class_name: string;
    student: UserInfo[];
}



export interface UserInfo{
    name: string;
    phone: string;
    last_photo: string;
    last_photo_time: number;
    school_id: number;
    user_type: number;
    class_id?: number | null;
    if_login: number;
    user_name: string;
    class_name?: string | null;
    school_name?: string | null;
    passowrd?: string | null | '';
}

export interface RedisClassInfo{
    class_id: string;
    student: UserInfo[];
    year: string; 
}
export interface SchoolInfo{
    school_id: string;
    class: RedisClassInfo[];
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
    last_photo_time:number;
    class_id: number;
}

// 老师获取学生照片的返回数据
export interface TeacherGetPhotoData{
    username: string;
    last_photo: string;
    last_photo_time:string;
    class_id: number;
    to_user_name: string;
}

// 保存的socket格式为

export interface SingleSocket{
    userinfo: UserInfo;
    id: string;
    socket: net.Socket;
    lastHeartBeat: number;
}