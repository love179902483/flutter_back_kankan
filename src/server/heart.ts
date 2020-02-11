import { Socket } from "dgram";
import { SingleSocket } from "../types/global";

export class HeartBeat{
    //  = Date.now()
    private lastBeatTime: number;

    static instance: HeartBeat = null;

    static thisHeartBeat(){
        if(HeartBeat.instance == null){
            HeartBeat.instance = new HeartBeat();
        }
        
        return HeartBeat.instance;
    }

    // 设置本次心跳的时间
    setHeartTimer(){
        HeartBeat.instance.lastBeatTime = Date.now();
    }

    /**
     * 测试是否心跳大于最大心跳间隔，若大于则断开socket
     * @param maxGap 最大的心跳间隔
     */
    checkLastTime(maxGap: number){
        const nowTime: number = Date.now();
        const timeGap: number = nowTime - HeartBeat.instance.lastBeatTime;
        if(timeGap < maxGap)
            return true;
        else
            return false;
    }

    // private heartBeatWord: number;
    // constructor(word: number){
    //     this.heartBeatWord = word;
    // }
    
}


export function checkLastTime(maxGap: number, socketStore: SingleSocket[] ){
    console.log('查询超时的tcp连接');
    for(let i=socketStore.length-1; i>=0 ;i--){
        const singleSocket: SingleSocket = socketStore[i];
        const nowTime: number = Date.now();
        const timeGap: number = nowTime - singleSocket.lastHeartBeat;
        console.log(`此tcp连接名字是${singleSocket.id}, 多久未连接:${timeGap},最大允许超时时间${maxGap}`)
        if(timeGap > maxGap){
            console.log(socketStore.length);
            console.log('找到了超时的tcp连接！');
            singleSocket.socket.destroy();
            socketStore.splice(i,1);
            console.log(socketStore.length);
        }
    }
 
}