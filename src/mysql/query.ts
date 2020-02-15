import { QueryPool } from "./mysql";
import * as mysql from 'mysql';
import { DataTabelToJson } from "../myUtil/utils";
import { NormalReturn, UserInfo, SingleSocket } from "../types/global";

// 验证是否登录
export async function queryPassword(userid: string, passowrd: string): Promise< NormalReturn<UserInfo>>{
    "select * from  user where user_phone='' and passworld=''"
    const query: string = `select user_name,password,phone,if_login, class_id, school_id, name, user_type, (select school_name from school where school_id= user.school_id) as school_name, (select class_name from class where class_id = user.class_id) as class_name from  user where user_name=${mysql.escape(userid)} and password=${passowrd} `;
    console.log(query);
    let returnMsg: NormalReturn<UserInfo> = {
        flag: false,
        data: {
            name:'',
            phone:'',
            school_id: null,
            class_id: null,
            if_login: null,
            user_type: null,
            last_photo: '',
            last_photo_time: null,
            user_name: '',
            passowrd: '',
            school_name: '',
        },
        msg: ''
    }
    try {
        const result: any[] = await QueryPool(query, "");
        if(result.length>1 || result.length ==0){
            console.log(`${userid} ${passowrd}查询出来的用户给数据个数不匹配个数为：${result.length}!`);
            returnMsg.msg = '没有此用户!'
        }else{
            returnMsg.data = result[0];
            returnMsg.flag = true;
        }
        
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '用户查询出错'
        return returnMsg;
    }

}


// 验证是否登录
/**
 * 
 * @param user_name 用户名
 * @param if_login true:设置登录状态为 1 false 0
 */
export async function updateLoginStatus(user_name: string, if_login: boolean): Promise< NormalReturn<string>>{
    // 0是未登录 1是已登录
    let status: number = 0;

    if(if_login)
        status = 1
 
    "select * from  user where user_phone='' and passworld=''"
    const query: string = `update user set if_login=${mysql.escape(status)} where user_name=${mysql.escape(user_name)};`;
    console.log(query);
    let returnMsg: NormalReturn<string> = {
        flag: false,
        data: '',
        msg: ''
    }
    try {
        const result = await QueryPool(query, "");
        // console.log(result);
        console.log('用户登录状态更新成功');
        returnMsg.flag = true;
        returnMsg.msg = '用户登录状态更新成功';
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '用户查询出错'
        return returnMsg;
    }

}


/**
 * 更新用户的最新照片
 * @param user_name 用户名
 * @param if_login true:设置登录状态为 1 false 0
 */
export async function updateUserLastPhoto(user_name: string, last_photo: string, photoTime: number): Promise< NormalReturn<string>>{
    
    const nowTime: number = photoTime;
    "update user set last_photo='' , last_photo_time=null where user_name='1390001';"
    "update user set if_login=${mysql.escape(status)} where user_name=${mysql.escape(user_name)};"
    const query: string = `update user set last_photo=${mysql.escape(last_photo)} , last_photo_time=${mysql.escape(nowTime)} where user_name=${mysql.escape(user_name)};`;
    console.log(query);
    let returnMsg: NormalReturn<string> = {
        flag: false,
        data: '',
        msg: ''
    }
    try {
        const result = await QueryPool(query, "");
        // console.log(result);
        // console.log('更新成功');
        // console.log(result);
        returnMsg.flag = true;
        returnMsg.msg = '更新最后图片时间和字段成功';
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '更新用户图片出错'
        return returnMsg;
    }

}

/**
 * 更新用户照片表照片
 * @param user_name 用户名
 * @param if_login true:设置登录状态为 1 false 0
 */
export async function insertUserLastPhoto(singleSocket: SingleSocket, last_photo: string, photoTime: number): Promise< NormalReturn<string>>{
    const user_name: string = singleSocket.id;
    const class_id: number = singleSocket.userinfo.class_id;
    const school_id: number = singleSocket.userinfo.school_id;
    const nowTime = photoTime;
    "update user set last_photo='' , last_photo_time=null where user_name='1390001';"
    "update user set if_login=${mysql.escape(status)} where user_name=${mysql.escape(user_name)};"
    const query: string = `
    insert into photo ( user_name,  class_id, school_id, create_time, photo_url) values(${mysql.escape(user_name)}, ${mysql.escape(class_id)} ,${mysql.escape(school_id)}, ${mysql.escape(nowTime)},${mysql.escape(last_photo)} );`;
    console.log(query);
    let returnMsg: NormalReturn<string> = {
        flag: false,
        data: '',
        msg: ''
    }
    try {
        const result = await QueryPool(query, "");
        // console.log(result);
        console.log('插入成功');
        console.log(result);
        returnMsg.flag = true;
        returnMsg.msg = '插入照片表成功';
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '插入照片表出错'
        return returnMsg;
    }

}



/**
 * 查询老师下面的所有班级
 * @param user_name 用户名
 * @param if_login true:设置登录状态为 1 false 0
 */
export async function selectAllClassNumber(user_name: string, school_id: number): Promise< NormalReturn<number[]>>{
    "select class_id from teacher_class where user_name='1390004' and school_id='2';"
    "update user set if_login=${mysql.escape(status)} where user_name=${mysql.escape(user_name)};"
    const query: string = `select user_name,phone,if_login, class_id, school_id, name, user_type from  user where class_id IN (select class_id from teacher_class where user_name=${mysql.escape(user_name)} and school_id=${mysql.escape(school_id)});`;
    console.log(query);
    let returnMsg: NormalReturn<number[]> = {
        flag: false,
        data: [],
        msg: ''
    }
    try {
        const result = await QueryPool(query, "");
        // console.log(result);
        returnMsg.flag = true;
        returnMsg.data = result;
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '用户查询出错'
        return returnMsg;
    }

}



/**
 * 查询老师班级下所有学生信息
 * @param user_name 用户名
 * @param if_login true:设置登录状态为 1 false 0
 */
export async function selectAllStudentInfoByTeacher(user_name: string, school_id: number): Promise< NormalReturn<UserInfo[]>>{
    "select user_name, phone,(select class_name from class where class_id = user.class_id ) from user where class_id IN (select class_id from teacher_class where user_name='1390004' and school_id='2');"
    "update user set if_login=${mysql.escape(status)} where user_name=${mysql.escape(user_name)};"
    const query: string = `select name, phone,last_photo, last_photo_time, school_id, user_type, class_id, if_login, user_name, (select class_name from class where class_id = user.class_id ) as class_name from user where class_id IN (select class_id from teacher_class where user_name=${mysql.escape(user_name)} and school_id=${mysql.escape(school_id)})`;
    console.log(query);
    let returnMsg: NormalReturn<UserInfo[]> = {
        flag: false,
        data: [],
        msg: ''
    }
    try {
        const result = await QueryPool(query, "");
        // console.log(result);
        returnMsg.flag = true;
        returnMsg.data = result;
        return returnMsg;
    } catch (error) {
        returnMsg.data = error;
        returnMsg.msg = '用户查询出错'
        return returnMsg;
    }

}