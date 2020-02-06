import { QYgetHashAll, QYgetHashKeys, QYgetHash } from "../redis/redis_promise";
import { SelectRedisClient } from "../myUtil/utils";
import { StudentInfo } from "../types/global";

export class GetClassData{

    private classNumber: string; 
    constructor(classNumber){
        this.classNumber = classNumber;
    }
    // 获取本班级中所有的同学信息并返回
    async getStudents(){
        try {
            let allStudentInfo: StudentInfo[] =[];
            // 先查询出班级中的所有学生
            await SelectRedisClient(0);
            const allStudent: string[]= await QYgetHashKeys(this.classNumber) as string[];
            // 通过学生查询出所有的学生数据 并拼接到 allStudentInfo 中
            await SelectRedisClient(1);
            for(let i=0, j=allStudent.length; i<j; i++){
                const thisStudent: StudentInfo =  await QYgetHashAll(allStudent[i]) as StudentInfo;
                allStudentInfo.push(thisStudent);
            }
          
            return allStudentInfo;
        } catch (error) {
            console.log(`获取${this.classNumber}班级所有学生信息出错`);  
            console.log(error);
        }
        
    }
}