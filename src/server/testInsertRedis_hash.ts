import { RedisClient } from '../redis/redis_pool';
import { SelectRedisClient, RedisExists } from '../myUtil/utils';
import { QYsetHashArray, setSetAdd } from '../redis/redis_promise';
import { SchoolInfo, ClassInfo, StudentInfo } from '../types/global';
import { ClassDataFun } from './classData';

// 在班级中添加学生
async function AddStudents(schoolInfo: SchoolInfo[]){
    for(let i in schoolInfo){
        const thisSchoolInfo: SchoolInfo = schoolInfo[i];
        const thisSchoolAllClass: ClassInfo[] = schoolInfo[i].class;
        const thisSchoolID: string = thisSchoolInfo.school_id;
        for( let j in thisSchoolAllClass){
            const thisClassInfo: ClassInfo = thisSchoolAllClass[j];
            const thisClassAllStudent: StudentInfo[] = thisSchoolAllClass[j].student;
            // 每个班级的ID名称
            const thisClassID: string = thisClassInfo.class_id;
            // 每个班级的入学年份
            const thisClassYear: string = thisClassInfo.year;
            for (let k in thisClassAllStudent){
                const thisStudentInfo: StudentInfo = thisClassAllStudent[k]; 

                const thisStudentName: string = thisStudentInfo.name;
                const thisStudentPhone: string = thisStudentInfo.phone;
                const thisStudent_Last_photo: string = thisStudentInfo.last_photo;
                const thisStudent_Last_photo_time: string = thisStudentInfo.last_photo_time;
                const thisStudent_Class_ID: string = thisClassID;
                const thisStudentID: string = thisStudentInfo.stduent_id;
                const thisStudent_Password: string = thisStudentInfo.password;
                const thisStudent_IfLogin: string = thisStudentInfo.if_login;

                const thisClassKey: string = `${thisSchoolID}:${thisClassID}`
                const thisStudentKey: string = `${thisClassKey}:${thisStudentID}`;
                const thisStudentImageKey: string = `${thisStudentKey}.image`;
                const sutudentInfo: string[] = ["name", thisStudentName, 
                                                "phone", thisStudentPhone, 
                                                "last_photo", thisStudent_Last_photo, 
                                                "last_photo_time", Date.now().toString(), 
                                                "student_id", thisStudentID,
                                                "class_number", `${thisSchoolID}:${thisStudent_Class_ID}`,
                                                "password", thisStudent_Password,
                                                "if_login", thisStudent_IfLogin]

                const classInfo: string[] = [
                    thisStudentPhone, `${thisStudentName}  ${thisStudentID} `
                ];
                console.log(thisClassKey, [])
                console.log(`学校编码是${thisSchoolID}`);
                // console.log(thisStudentKey)
                // console.log(thisStudentImageKey)

                
                // 设置每个班级
                await SelectRedisClient(0);
                await QYsetHashArray(thisClassKey, classInfo);
                await SelectRedisClient(1);
                await QYsetHashArray(thisStudentPhone, sutudentInfo);
                await SelectRedisClient(2);
                await QYsetHashArray(`${thisStudentPhone}.image`, [Date.now().toString(), thisStudent_Last_photo])
            }
            
            
        }
    }
}

function getAllData(){

}

export async function test(){
    try {
        AddStudents(ClassDataFun());  //添加学校 班级 学生的时候
        

        

        // await SelectRedisClient(0);
        // await QYgetHashAll("001:04:001:0001");
        // console.log(await QYsetHashArray('001:04:001:0002', ["name", "你妹", "lastPhoto","123123", "lastPhotoTime", "123123", "phone","123"]))
        // const returnMsg = await QYsetHash("001:04:001:0001", "name", '名字')
        // console.log(returnMsg)



    } catch (error) {
        console.error(error);
    }
    
}