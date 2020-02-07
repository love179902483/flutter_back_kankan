import { RedisClient } from '../redis/redis_pool';
import { NormalReturn, StudentInfo, SingleSocket } from '../types/global';
import { RedisList, RedisExists, SelectRedisClient, deleteSocket } from '../myUtil/utils';
import { QYgetHash, QYsetHash, QYgetHashAll } from '../redis/redis_promise';

 /**
 * 通过用户id将redis中的用户登录标志字段设置为 1。 注：0 未登录 1 登录
 * @param userName 用户信息
 */
async function login(userName: string){
    try {
        // 返回为true 则表示设置成功
        await SelectRedisClient(1);
        const result = await QYsetHash(userName, "if_login", '1');
        return result; 
    } catch (error) {
        console.log(error);
    }

}

async function logout(userName: string){
    try {
        await SelectRedisClient(1);
        const logout = await QYsetHash(userName, "if_login", '0');
        console.log(`logout 重置redis结果是 ${logout}`);
        return logout;
    } catch (error) {
        console.log(error);
    }


};
        


class CheckUser{
    private userData: any = "";
    private user: string = "";
    private userName: string = "";
    private socketStore: SingleSocket[] = [];
    constructor(socketStore: SingleSocket[], data: any){
        this.userData = data;
        this.socketStore = socketStore;
    }

    async check():Promise< NormalReturn<any>>{
        const returnMsg: NormalReturn<any> = {
            flag: false,
            msg: '',
            data: ''
        }
        // user === "" 说明还没验证用户
        try {
            // 先选择第0个数据库
            await SelectRedisClient(0);
            console.log(this.userData)
            console.log(this.userData)
            console.log(JSON.parse(this.userData) )
            let thisCheckJson = JSON.parse(this.userData); 
            console.log(thisCheckJson['userName']);
            if(thisCheckJson.hasOwnProperty('userName')){
                // 判断redis中是否有这个用户
                console.log(`User need to check is : ${thisCheckJson['userName']} `);
                // 先选择一下存储用户的数据库
                await SelectRedisClient(1);
                const hasUser = await QYgetHash(thisCheckJson['userName'], 'password');
                console.log(`is the ${thisCheckJson['userName']} in Redis? answer :${hasUser}`)
                
                if(hasUser && thisCheckJson['password'] === hasUser){
                    
                    const myUserInfo: StudentInfo = await QYgetHashAll(thisCheckJson['userName']) as StudentInfo;
                    // 若用户存在则判断是否在登录状态 0 代表未登录 1 代表登录
                    const ifLogin = myUserInfo.if_login;
                    console.log(`User info : ${thisCheckJson['userName']}, first Data: if login? ${ifLogin} type is ${ typeof ifLogin}`)
                    // 若用户已经登录了则返回不可再次登录并断开socket
                    if(ifLogin === '0'){
                        returnMsg.flag = true; 
                        returnMsg.data = myUserInfo;
                        returnMsg.msg = `login Success!! ${thisCheckJson['userName']}`;
                    }else if(ifLogin === '1'){
                        for(let i=0, j=this.socketStore.length; i<j;i++){
                            if(this.socketStore[i].id === thisCheckJson['userName'])
                                this.socketStore[i].socket.destroy();
                        }
                        await logout(thisCheckJson['userName'])
                        returnMsg.flag = true; 
                        returnMsg.data = myUserInfo;
                        returnMsg.msg = `${thisCheckJson['userName']} logout and  login again!!`;
                    }else{
                        // 若登录标志字段有问题则纠正为 0 也就是未登录！！
                        await logout(thisCheckJson['userName']);
                        console.log('用户登录标志字段有误,重置标志字段'+ await logout(thisCheckJson['userName']))
                        returnMsg.msg = `${thisCheckJson['userName']} login check out info error!!!`;
                    }
                }else{
                    returnMsg.msg = 'no user here!! or user password wrong!!!';
                }
            }else{
                returnMsg.msg = 'got user info error!!'
            }
        } catch (error) {
            console.error(error);
            // return false;
            returnMsg.msg = "user info error!!!!!!";
        }

        return returnMsg;
    }
   

}

export { CheckUser, login, logout };