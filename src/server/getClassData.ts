// import { QYgetHashAll, QYgetHashKeys, QYgetHash } from "../redis/redis_promise";
// import { SelectRedisClient } from "../myUtil/utils";
import { UserInfo, NormalReturn, ClassInfo } from "../types/global";
import { selectAllClassNumber, selectAllStudentInfoByTeacher } from "../mysql/query";


export class TeacherGetClass{
    private user_name: string;
    private user_type: number;
    constructor(user_name: string, user_type: number){
        this.user_name = user_name;
        this.user_type = user_type;
    }

    async getAllClass(): Promise< NormalReturn<ClassInfo[]>>{
        let returnMsg: NormalReturn<ClassInfo[]>={
            flag: false,
            data: [],
            msg: '',
        }


        const allClassMemberInfo: NormalReturn<UserInfo[]> = await selectAllStudentInfoByTeacher(this.user_name, this.user_type);
        // console.log(allClassMemberInfo);
        if(allClassMemberInfo.flag){

            try {
                let allClassInfo: ClassInfo[] = [];
                for(let i=0, j=allClassMemberInfo.data.length; i<j;i++){
                    const thisStudent: UserInfo = allClassMemberInfo.data[i];

                    let tempClassInfo: ClassInfo = {
                        class_id: null,
                        class_name: '',
                        student: []
                    };

                    // 若classinfo[]中没有元素的时候则将第一个元素放入其中
                    if(allClassInfo.length === 0){
                       
                        tempClassInfo.class_name = thisStudent.class_name;

                        tempClassInfo.class_id = thisStudent.class_id;
                        tempClassInfo.student.push(thisStudent);
                        allClassInfo.push(tempClassInfo);
                        continue;
                    }else{
    
                        let ifInClass: boolean = false;
                        for(let m=0 ,n=allClassInfo.length; m<n; m++){
                            const thisClass_id: number = allClassInfo[m].class_id;
                            if(thisClass_id === thisStudent.class_id){
                                allClassInfo[m].student.push(thisStudent);
                                ifInClass = true;
                                break;
                            }
                        }
                        if(ifInClass === false){
                            tempClassInfo.class_id = thisStudent.class_id;
                            tempClassInfo.class_name = thisStudent.class_name;
                            tempClassInfo.student.push(thisStudent);
                            allClassInfo.push(tempClassInfo);
                        }
                    }
                }
                console.log(JSON.stringify(allClassInfo));
                returnMsg.data = allClassInfo;
                returnMsg.flag = true;
            } catch (error) {
                console.log(error)
            }
           
            return returnMsg
        }else{
            return returnMsg
        }

        
        
    }

}




// export class GetClassData{

//     private classNumber: string; 
//     constructor(classNumber){
//         this.classNumber = classNumber;
//     }
//     // 获取本班级中所有的同学信息并返回
//     async getStudents(){
//         try {
//             let allStudentInfo: UserInfo[] =[];
//             // 先查询出班级中的所有学生
//             // await SelectRedisClient(0);
//             const allStudent: string[]= await QYgetHashKeys(this.classNumber) as string[];
//             // 通过学生查询出所有的学生数据 并拼接到 allStudentInfo 中
//             // await SelectRedisClient(1);
//             for(let i=0, j=allStudent.length; i<j; i++){
//                 const thisStudent: UserInfo =  await QYgetHashAll(allStudent[i]) as UserInfo;
//                 allStudentInfo.push(thisStudent);
//             }
          
//             return allStudentInfo;
//         } catch (error) {
//             console.log(error);
//             console.log(`获取${this.classNumber}班级所有学生信息出错`);  
//             return [];
//         }
        
//     }
// }
